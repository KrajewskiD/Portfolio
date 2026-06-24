import type { ReactNode } from "react";

import type { Language } from "@shared/database/types/language";

import AdminTranslatableField from "./AdminTranslatableField";
import { useLocalizedFieldState } from "./adminLocalizedFieldState";

type AdminLocalizedFieldRenderProps<TPl extends string, TEn extends string> = {
  id: string;
  disabled: boolean;
  localizedKey: TPl | TEn;
  localizedValue: string;
  onLocalizedChange: (value: string) => void;
};

type AdminLocalizedFieldShellProps<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
> = {
  id: string;
  label: string;
  hint?: string;
  language: Language;
  className?: string;
  disabled?: boolean;
  source: TSource;
  plKey: TPl;
  enKey: TEn;
  onChange: (field: TPl | TEn, value: string) => void;
  children: (props: AdminLocalizedFieldRenderProps<TPl, TEn>) => ReactNode;
};

function AdminLocalizedFieldShell<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>({
  id,
  label,
  hint,
  language,
  className,
  disabled = false,
  source,
  plKey,
  enKey,
  onChange,
  children,
}: AdminLocalizedFieldShellProps<TPl, TEn, TSource>) {
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
      {children({
        id,
        disabled,
        localizedKey,
        localizedValue,
        onLocalizedChange: (value) => onChange(localizedKey, value),
      })}
    </AdminTranslatableField>
  );
}

export default AdminLocalizedFieldShell;
