import { useMemo } from "react";

import type { Language } from "@shared/database/types/language";

import AdminInput from "./AdminInput";
import AdminTranslatableField from "./AdminTranslatableField";
import AdminTextarea from "./AdminTextarea";

function useLocalizedFieldState<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>(source: TSource, language: Language, plKey: TPl, enKey: TEn) {
  return useMemo(() => {
    const localizedKey = (language === "pl" ? plKey : enKey) as TPl | TEn;
    const oppositeKey = (language === "pl" ? enKey : plKey) as TPl | TEn;
    const localizedValue = source[localizedKey];

    return {
      localizedKey,
      oppositeKey,
      localizedValue,
      sourceText: localizedValue,
    };
  }, [enKey, language, plKey, source]);
}

type AdminLocalizedInputProps<
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
  maxLength?: number;
};

export function AdminLocalizedInput<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>({
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
}: AdminLocalizedInputProps<TPl, TEn, TSource>) {
  const { localizedKey, oppositeKey, localizedValue, sourceText } =
    useLocalizedFieldState(source, language, plKey, enKey);

  return (
    <AdminTranslatableField
      id={id}
      label={label}
      hint={hint}
      language={language}
      disabled={disabled}
      sourceText={sourceText}
      onApply={(text) => onChange(oppositeKey, text)}
    >
      <AdminInput
        id={id}
        maxLength={maxLength}
        value={localizedValue}
        disabled={disabled}
        onChange={(event) => onChange(localizedKey, event.target.value)}
      />
    </AdminTranslatableField>
  );
}

type AdminLocalizedTextareaProps<
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

export function AdminLocalizedTextarea<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>({
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
}: AdminLocalizedTextareaProps<TPl, TEn, TSource>) {
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
    </AdminTranslatableField>
  );
}
