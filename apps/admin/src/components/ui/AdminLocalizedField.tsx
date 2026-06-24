import type { ReactNode } from "react";
import type { Language } from "@shared/database/types/language";

import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";
import AdminLocalizedFieldShell from "./AdminLocalizedFieldShell";

type AdminLocalizedFieldBaseProps<
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
};

type AdminLocalizedInputProps<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
> = AdminLocalizedFieldBaseProps<TPl, TEn, TSource> & {
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
  return (
    <AdminLocalizedFieldShell
      id={id}
      label={label}
      hint={hint}
      language={language}
      disabled={disabled}
      source={source}
      plKey={plKey}
      enKey={enKey}
      onChange={onChange}
    >
      {({
        id: inputId,
        disabled: isDisabled,
        localizedValue,
        onLocalizedChange,
      }) => (
        <AdminInput
          id={inputId}
          maxLength={maxLength}
          value={localizedValue}
          disabled={isDisabled}
          onChange={(event) => onLocalizedChange(event.target.value)}
        />
      )}
    </AdminLocalizedFieldShell>
  );
}

export type AdminLocalizedTextareaProps<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
> = AdminLocalizedFieldBaseProps<TPl, TEn, TSource> & {
  rows?: number;
  className?: string;
  after?: (localizedValue: string) => ReactNode;
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
  after,
}: AdminLocalizedTextareaProps<TPl, TEn, TSource>) {
  return (
    <AdminLocalizedFieldShell
      id={id}
      label={label}
      hint={hint}
      language={language}
      className={className}
      disabled={disabled}
      source={source}
      plKey={plKey}
      enKey={enKey}
      onChange={onChange}
    >
      {({
        id: textareaId,
        disabled: isDisabled,
        localizedValue,
        onLocalizedChange,
      }) => (
        <>
          <AdminTextarea
            id={textareaId}
            rows={rows}
            value={localizedValue}
            disabled={isDisabled}
            onChange={(event) => onLocalizedChange(event.target.value)}
          />
          {after?.(localizedValue)}
        </>
      )}
    </AdminLocalizedFieldShell>
  );
}
