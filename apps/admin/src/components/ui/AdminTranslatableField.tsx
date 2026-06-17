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
  className,
}: AdminTranslatableFieldProps) {
  return (
    <AdminField
      id={id}
      label={label}
      hint={hint}
      className={className}
      action={
        <AdminTranslateButton
          language={language}
          disabled={translateDisabled ?? !onTranslate}
          onClick={onTranslate}
        />
      }
    >
      {children}
    </AdminField>
  );
}

export default AdminTranslatableField;
