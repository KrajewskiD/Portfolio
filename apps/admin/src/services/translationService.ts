import { supabase } from "@admin/lib/supabase";
import {
  beginTranslationCancellation,
  TranslationCancelledError,
} from "@admin/services/translationCancellation";
import { env } from "@shared/config/env";
import type { Language } from "@shared/database/types/language";

export { cancelActiveTranslation } from "@admin/services/translationCancellation";
export { isTranslationCancelledError } from "@admin/services/translationCancellation";

export type TranslationItem = {
  id: string;
  text: string;
};

type TranslateTextsParams = {
  items: TranslationItem[];
  sourceLanguage: Language;
  targetLanguage: Language;
};

type TranslateTextParams = {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
};

type TranslateTextsResponse = {
  translations?: TranslationItem[];
};

type TranslateTextErrorBody = {
  error?: string;
};

function mapEdgeFunctionError(error: string): string {
  switch (error) {
    case "Unauthorized":
      return "Brak autoryzacji. Zaloguj się ponownie do panelu admina.";
    case "Invalid request":
      return "Nieprawidłowe żądanie tłumaczenia.";
    case "Text too long":
      return "Tekst jest za długi (maks. 5000 znaków).";
    case "Batch too large":
      return "Za dużo treści do tłumaczenia w jednym żądaniu.";
    case "Too many requests":
      return "Zbyt wiele żądań. Spróbuj za chwilę.";
    case "Translation service unavailable":
      return "Usługa Gemini niedostępna. Sprawdź GEMINI_API_KEY i logi funkcji.";
    case "Translation failed":
      return "Gemini nie zwróciło tłumaczenia.";
    case "Internal Server Error":
      return "Błąd serwera tłumaczenia. Sprawdź sekrety i logi Edge Function.";
    default:
      return error;
  }
}

async function getResponseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as TranslateTextErrorBody;

    if (body.error) {
      return mapEdgeFunctionError(body.error);
    }
  } catch {
    // response body not JSON
  }

  return `Błąd Edge Function (HTTP ${response.status}).`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export async function translateTexts({
  items,
  sourceLanguage,
  targetLanguage,
}: TranslateTextsParams): Promise<TranslationItem[]> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Brak autoryzacji. Zaloguj się ponownie do panelu admina.");
  }

  const cancellation = beginTranslationCancellation();

  try {
    const response = await fetch(
      `${env.supabaseUrl}/functions/v1/translate-text`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: env.supabasePublishableKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, sourceLanguage, targetLanguage }),
        signal: cancellation.signal,
      },
    );

    if (cancellation.isCancelled()) {
      throw new TranslationCancelledError();
    }

    if (!response.ok) {
      throw new Error(await getResponseErrorMessage(response));
    }

    const data = (await response.json()) as TranslateTextsResponse | null;

    if (!data?.translations?.length) {
      throw new Error("Brak przetłumaczonych pól w odpowiedzi.");
    }

    return data.translations;
  } catch (error) {
    if (isAbortError(error) || cancellation.isCancelled()) {
      throw new TranslationCancelledError();
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Nie udało się przetłumaczyć.");
  } finally {
    cancellation.dispose();
  }
}

export async function translateText({
  text,
  sourceLanguage,
  targetLanguage,
}: TranslateTextParams): Promise<string> {
  const translations = await translateTexts({
    items: [{ id: "single", text }],
    sourceLanguage,
    targetLanguage,
  });

  const translatedText = translations.find(
    (item) => item.id === "single",
  )?.text;

  if (!translatedText) {
    throw new Error("Brak przetłumaczonego tekstu w odpowiedzi.");
  }

  return translatedText;
}
