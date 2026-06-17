import type { ReactNode } from "react";

import type { Language } from "@shared/database/types/language";

import AdminField from "./AdminField";
import AdminTranslateButton from "./AdminTranslateButton";

type AdminTranslatableFieldProps = {
  id: string;
  label: string;
  hint?: string;
  language: Language;
  children: ReactNode;
  onTranslate?: () => void;
  translateDisabled?: boolean;
  isTranslating?: boolean;
  translateError?: string;
  className?: string;
};

function AdminTranslatableField({
  id,
  label,
  hint,
  language,
  children,
  onTranslate,
  translateDisabled,
  isTranslating,
  translateError,
  className,
}: AdminTranslatableFieldProps) {
  return (
    <AdminField
      id={id}
      label={label}
      hint={translateError ?? hint}
      className={[
        className,
        translateError ? "admin-field--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      action={
        <AdminTranslateButton
          language={language}
          disabled={translateDisabled ?? !onTranslate}
          isLoading={isTranslating}
          onClick={onTranslate}
        />
      }
    >
      {children}
    </AdminField>
  );
}

export default AdminTranslatableField;
