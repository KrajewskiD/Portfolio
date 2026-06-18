import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Language = "pl" | "en";

type TranslationItem = {
  id: string;
  text: string;
};

const ALLOWED_LANGUAGES = new Set<Language>(["pl", "en"]);
const MAX_ITEM_LENGTH = 5000;
const MAX_ITEMS = 30;
const MAX_BATCH_LENGTH = 20_000;
const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
] as const;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

const hits = new Map<string, { count: number; resetAt: number }>();

function getCorsHeaders(req: Request) {
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const origin = req.headers.get("Origin") ?? "";
  const isAllowed = allowed.length === 0 || allowed.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin || allowed[0] : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, req: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && ALLOWED_LANGUAGES.has(value as Language);
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = hits.get(userId);

  if (!entry || now > entry.resetAt) {
    hits.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableGeminiStatus(status: number): boolean {
  return status === 429 || status === 503;
}

function normalizeItems(body: Record<string, unknown>): TranslationItem[] | null {
  if (Array.isArray(body.items)) {
    const items: TranslationItem[] = [];

    for (const item of body.items) {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof (item as TranslationItem).id !== "string" ||
        typeof (item as TranslationItem).text !== "string"
      ) {
        return null;
      }

      const { id, text } = item as TranslationItem;
      const trimmed = text.trim();

      if (!id.trim() || !trimmed) {
        continue;
      }

      items.push({ id: id.trim(), text: trimmed });
    }

    return items;
  }

  if (typeof body.text === "string" && body.text.trim()) {
    return [{ id: "single", text: body.text.trim() }];
  }

  return null;
}

function validateItems(items: TranslationItem[]): string | null {
  if (items.length === 0) {
    return "Invalid request";
  }

  if (items.length > MAX_ITEMS) {
    return "Batch too large";
  }

  const totalLength = items.reduce((sum, item) => sum + item.text.length, 0);

  if (totalLength > MAX_BATCH_LENGTH) {
    return "Batch too large";
  }

  for (const item of items) {
    if (item.text.length > MAX_ITEM_LENGTH) {
      return "Text too long";
    }
  }

  return null;
}

async function callGemini(
  apiKey: string,
  model: string,
  items: TranslationItem[],
  sourceLanguage: Language,
  targetLanguage: Language,
): Promise<Response> {
  const inputJson = JSON.stringify(items);

  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text:
              `Translate each object's "text" field from ${sourceLanguage} to ${targetLanguage}. ` +
              `Keep every "id" unchanged. Return ONLY a JSON array of objects ` +
              `{"id":"...","text":"..."} with the same ids. No markdown.\n\n` +
              `Input:\n${inputJson}`,
          }],
        }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    },
  );
}

function parseGeminiTranslations(raw: string): TranslationItem[] {
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid Gemini JSON shape");
  }

  return parsed.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as TranslationItem).id !== "string" ||
      typeof (item as TranslationItem).text !== "string"
    ) {
      throw new Error("Invalid translation item");
    }

    return {
      id: (item as TranslationItem).id.trim(),
      text: (item as TranslationItem).text.trim(),
    };
  });
}

async function translateBatchWithGemini(
  apiKey: string,
  items: TranslationItem[],
  sourceLanguage: Language,
  targetLanguage: Language,
): Promise<TranslationItem[]> {
  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const res = await callGemini(
        apiKey,
        model,
        items,
        sourceLanguage,
        targetLanguage,
      );

      if (res.ok) {
        const data = await res.json();
        const raw =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

        if (!raw) {
          throw new Error("Empty translation");
        }

        const translations = parseGeminiTranslations(raw);
        const byId = new Map(translations.map((item) => [item.id, item.text]));

        return items.map((item) => {
          const text = byId.get(item.id);

          if (!text) {
            throw new Error(`Missing translation for id: ${item.id}`);
          }

          return { id: item.id, text };
        });
      }

      const details = await res.text();
      console.error(
        `Gemini error [${model}, attempt ${attempt}]:`,
        res.status,
        details,
      );

      if (isRetryableGeminiStatus(res.status) && attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      break;
    }
  }

  throw new Error("Translation service unavailable");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401, req);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401, req);

    if (!checkRateLimit(user.id)) {
      return json({ error: "Too many requests" }, 429, req);
    }

    const body = await req.json();
    const { sourceLanguage, targetLanguage } = body;

    if (!isLanguage(sourceLanguage) || !isLanguage(targetLanguage)) {
      return json({ error: "Invalid request" }, 400, req);
    }

    if (sourceLanguage === targetLanguage) {
      return json({ error: "Invalid request" }, 400, req);
    }

    const items = normalizeItems(body);

    if (!items) {
      return json({ error: "Invalid request" }, 400, req);
    }

    const validationError = validateItems(items);

    if (validationError) {
      return json({ error: validationError }, 400, req);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return json({ error: "Internal Server Error" }, 500, req);
    }

    const translations = await translateBatchWithGemini(
      apiKey,
      items,
      sourceLanguage,
      targetLanguage,
    );

    return json({
      translations,
      translatedText: translations.length === 1
        ? translations[0].text
        : undefined,
    }, 200, req);
  } catch (e) {
    console.error("translate-text error:", e);

    if (e instanceof Error && e.message === "Translation service unavailable") {
      return json({ error: "Translation service unavailable" }, 502, req);
    }

    if (e instanceof Error && e.message === "Empty translation") {
      return json({ error: "Translation failed" }, 502, req);
    }

    return json({ error: "Internal Server Error" }, 500, req);
  }
});
