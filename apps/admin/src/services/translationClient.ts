import { supabase } from "@admin/lib/supabase";
import {
  beginTranslationCancellation,
  TranslationCancelledError,
} from "@admin/services/translationCancellation";
import { getTranslationResponseErrorMessage } from "@admin/services/translationErrorMapper";
import { env } from "@shared/config/env";
import type { Language } from "@shared/database/types/language";

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

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

async function getTranslationAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Brak autoryzacji. Zaloguj się ponownie do panelu admina.");
  }

  return session.access_token;
}

export async function translateTexts({
  items,
  sourceLanguage,
  targetLanguage,
}: TranslateTextsParams): Promise<TranslationItem[]> {
  const accessToken = await getTranslationAccessToken();
  const cancellation = beginTranslationCancellation();

  try {
    const response = await fetch(
      `${env.supabaseUrl}/functions/v1/translate-text`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
      throw new Error(await getTranslationResponseErrorMessage(response));
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

    throw new Error("Nie udało się przetłumaczyć.", { cause: error });
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
