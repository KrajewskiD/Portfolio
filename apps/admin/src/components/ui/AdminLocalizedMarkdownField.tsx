import { markdownFieldHint } from "@shared/content/markdownHint";
import type { Language } from "@shared/database/types/language";

import AdminMarkdownPreview from "./AdminMarkdownPreview";
import AdminTextarea from "./AdminTextarea";
import AdminTranslatableField from "./AdminTranslatableField";
import { useLocalizedFieldState } from "./adminLocalizedFieldState";

type AdminLocalizedMarkdownFieldProps<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
> = {
  id: string;
  label: string;
  hint?: string;
  language: Language;
  disabled?: boolean;
  source: TSource;
  plKey: TPl;
  enKey: TEn;
  onChange: (field: TPl | TEn, value: string) => void;
  rows?: number;
  className?: string;
};

export function AdminLocalizedMarkdownField<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>({
  id,
  label,
  hint = markdownFieldHint,
  language,
  disabled = false,
  source,
  plKey,
  enKey,
  onChange,
  rows = 8,
  className,
}: AdminLocalizedMarkdownFieldProps<TPl, TEn, TSource>) {
  const { localizedKey, oppositeKey, localizedValue, sourceText } =
    useLocalizedFieldState(source, language, plKey, enKey);

  return (
    <AdminTranslatableField
      id={id}
      label={label}
      hint={hint}
      language={language}
      className={className}
      disabled={disabled}
      sourceText={sourceText}
      onApply={(text) => onChange(oppositeKey, text)}
    >
      <AdminTextarea
        id={id}
        rows={rows}
        value={localizedValue}
        disabled={disabled}
        onChange={(event) => onChange(localizedKey, event.target.value)}
      />
      <AdminMarkdownPreview content={localizedValue} />
    </AdminTranslatableField>
  );
}
