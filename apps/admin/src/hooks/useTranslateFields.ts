import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
import { useTranslationRunner } from "@admin/hooks/useTranslationRunner";
import { translateTexts } from "@admin/services/translationService";
import { getOppositeLanguage } from "@shared/utils/localizedField";
import type { Language } from "@shared/database/types/language";

export type TranslateFieldItem = {
  id: string;
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
  const { isOverlayOpen } = useTranslationOverlay();
  const { run, isTranslating, error } = useTranslationRunner();

  async function onTranslateAll() {
    const fieldsToTranslate = fields.filter((field) => field.sourceText.trim());

    await run({
      disabled: disabled || isOverlayOpen,
      validate: () => {
        if (fieldsToTranslate.length === 0) {
          return "Brak pól do przetłumaczenia w aktywnym języku.";
        }

        return undefined;
      },
      execute: async () => {
        const targetLanguage = getOppositeLanguage(language);
        const translations = await translateTexts({
          sourceLanguage: language,
          targetLanguage,
          items: fieldsToTranslate.map((field) => ({
            id: field.id,
            text: field.sourceText.trim(),
          })),
        });

        const translationsById = new Map(
          translations.map((item) => [item.id, item.text]),
        );

        for (const field of fieldsToTranslate) {
          const translatedText = translationsById.get(field.id);

          if (!translatedText) {
            throw new Error(`Brak tłumaczenia dla pola: ${field.id}`);
          }

          field.onApply(translatedText);
        }
      },
      successMessage: "Wszystkie pola zostały przetłumaczone.",
      fallbackError: "Nie udało się przetłumaczyć pól.",
    });
  }

  return { onTranslateAll, isTranslating, error };
}
