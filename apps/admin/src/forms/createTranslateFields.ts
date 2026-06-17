import type { TranslateFieldItem } from "@admin/hooks/useTranslateFields";
import type { Language } from "@shared/database/types/language";
import {
  getLocalizedField,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

export type LocalizedFieldConfig<TKey extends string> = {
  id: string;
  plKey: TKey;
  enKey: TKey;
};

export function createTranslateFields<
  TEntity extends Record<string, unknown>,
  TKey extends string,
>(
  entity: TEntity,
  language: Language,
  fields: LocalizedFieldConfig<TKey>[],
  onApply: (targetKey: TKey, text: string) => void,
): TranslateFieldItem[] {
  return fields.map((field) => ({
    id: field.id,
    sourceText: getLocalizedField(
      entity,
      language,
      field.plKey,
      field.enKey,
    ) as string,
    onApply: (text) =>
      onApply(
        getOppositeLocalizedKey(language, field.plKey, field.enKey),
        text,
      ),
  }));
}
