import type { Language } from "@shared/database/types/language";
import {
  getLocalizedField,
  getLocalizedKey,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

import AdminInput from "./AdminInput";
import AdminTranslatableField from "./AdminTranslatableField";
import AdminTextarea from "./AdminTextarea";

type LocalizedValueSource = Record<string, unknown>;

function readLocalizedString(
  source: LocalizedValueSource,
  language: Language,
  plKey: string,
  enKey: string,
): string {
  const value = getLocalizedField(
    source,
    language,
    plKey as never,
    enKey as never,
  );

  return typeof value === "string" ? value : "";
}

type AdminLocalizedInputProps<TField extends string> = {
  id: string;
  label: string;
  hint?: string;
  language: Language;
  disabled?: boolean;
  source: LocalizedValueSource;
  plKey: TField;
  enKey: TField;
  onChange: (field: TField, value: string) => void;
  maxLength?: number;
};

export function AdminLocalizedInput<TField extends string>({
  id,
  label,
  hint,
  language,
  disabled = false,
  source,
  plKey,
  enKey,
  onChange,
  maxLength,
}: AdminLocalizedInputProps<TField>) {
  return (
    <AdminTranslatableField
      id={id}
      label={label}
      hint={hint}
      language={language}
      disabled={disabled}
      sourceText={readLocalizedString(source, language, plKey, enKey)}
      onApply={(text) =>
        onChange(getOppositeLocalizedKey(language, plKey, enKey), text)
      }
    >
      <AdminInput
        id={id}
        maxLength={maxLength}
        value={readLocalizedString(source, language, plKey, enKey)}
        disabled={disabled}
        onChange={(event) =>
          onChange(getLocalizedKey(language, plKey, enKey), event.target.value)
        }
      />
    </AdminTranslatableField>
  );
}

type AdminLocalizedTextareaProps<TField extends string> = {
  id: string;
  label: string;
  hint?: string;
  language: Language;
  disabled?: boolean;
  source: LocalizedValueSource;
  plKey: TField;
  enKey: TField;
  onChange: (field: TField, value: string) => void;
  rows?: number;
  className?: string;
  fillHeight?: boolean;
};

export function AdminLocalizedTextarea<TField extends string>({
  id,
  label,
  hint,
  language,
  disabled = false,
  source,
  plKey,
  enKey,
  onChange,
  rows = 5,
  className,
  fillHeight = false,
}: AdminLocalizedTextareaProps<TField>) {
  const contentField = getLocalizedKey(language, plKey, enKey);

  return (
    <AdminTranslatableField
      id={id}
      label={label}
      hint={hint}
      language={language}
      className={[className, fillHeight ? "admin-field--fill" : ""]
        .filter(Boolean)
        .join(" ") || undefined}
      disabled={disabled}
      sourceText={readLocalizedString(source, language, plKey, enKey)}
      onApply={(text) =>
        onChange(getOppositeLocalizedKey(language, plKey, enKey), text)
      }
    >
      <AdminTextarea
        id={id}
        rows={fillHeight ? undefined : rows}
        value={readLocalizedString(source, language, plKey, enKey)}
        disabled={disabled}
        onChange={(event) => onChange(contentField, event.target.value)}
      />
    </AdminTranslatableField>
  );
}
