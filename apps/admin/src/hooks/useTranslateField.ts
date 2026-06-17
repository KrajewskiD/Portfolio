import { useState } from "react";

import { translateText } from "@admin/services/translationService";
import type { Language } from "@shared/database/types/language";

type UseTranslateFieldParams = {
  language: Language;
  sourceText: string;
  onApply: (translatedText: string) => void;
  disabled?: boolean;
};

export function useTranslateField({
  language,
  sourceText,
  onApply,
  disabled = false,
}: UseTranslateFieldParams) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string>();

  async function onTranslate() {
    if (disabled || isTranslating) {
      return;
    }

    const trimmed = sourceText.trim();
    if (!trimmed) {
      setError("Najpierw wpisz tekst w aktywnym języku.");
      return;
    }

    setIsTranslating(true);
    setError(undefined);

    try {
      const translatedText = await translateText({
        text: trimmed,
        sourceLanguage: language,
        targetLanguage: language === "pl" ? "en" : "pl",
      });
      onApply(translatedText);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się przetłumaczyć.",
      );
    } finally {
      setIsTranslating(false);
    }
  }

  return { onTranslate, isTranslating, error };
}
