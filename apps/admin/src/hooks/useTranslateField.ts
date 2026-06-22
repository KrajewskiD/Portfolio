import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import { useTranslationRunner } from "@admin/hooks/useTranslationRunner";
import { translateText } from "@admin/services/translationService";
import { getOppositeLanguage } from "@shared/utils/localizedField";
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
  const { isOverlayOpen } = useTranslationOverlay();
  const { run, isTranslating, error } = useTranslationRunner();

  async function onTranslate() {
    await run({
      disabled: disabled || isOverlayOpen,
      validate: () => {
        if (!sourceText.trim()) {
          return "Najpierw wpisz tekst w aktywnym języku.";
        }

        return undefined;
      },
      execute: async () => {
        const translatedText = await translateText({
          text: sourceText.trim(),
          sourceLanguage: language,
          targetLanguage: getOppositeLanguage(language),
        });

        onApply(translatedText);
      },
      successMessage: "Tłumaczenie zakończone pomyślnie.",
      fallbackError: "Nie udało się przetłumaczyć.",
    });
  }

  return { onTranslate, isTranslating, error };
}
