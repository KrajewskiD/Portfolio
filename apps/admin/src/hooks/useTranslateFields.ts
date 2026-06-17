import { useState } from "react";

import { translateText } from "@admin/services/translationService";
import type { Language } from "@shared/database/types/language";

type TranslateFieldItem = {
  sourceText: string;
  onApply: (translatedText: string) => void;
};

type UseTranslateFieldsParams = {
  language: Language;
  fields: TranslateFieldItem[];
  disabled?: boolean;
};

export function useTranslateFields({
  language,
  fields,
  disabled = false,
}: UseTranslateFieldsParams) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string>();

  async function onTranslateAll() {
    if (disabled || isTranslating) {
      return;
    }

    const fieldsToTranslate = fields.filter((field) => field.sourceText.trim());

    if (fieldsToTranslate.length === 0) {
      setError("Brak pól do przetłumaczenia w aktywnym języku.");
      return;
    }

    setIsTranslating(true);
    setError(undefined);

    try {
      const targetLanguage: Language = language === "pl" ? "en" : "pl";

      for (const field of fieldsToTranslate) {
        const translatedText = await translateText({
          text: field.sourceText.trim(),
          sourceLanguage: language,
          targetLanguage,
        });
        field.onApply(translatedText);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się przetłumaczyć pól.",
      );
    } finally {
      setIsTranslating(false);
    }
  }

  return { onTranslateAll, isTranslating, error };
}
