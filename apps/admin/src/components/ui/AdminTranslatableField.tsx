import type { ReactNode } from "react";

import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
import { useTranslateField } from "@admin/hooks/useTranslateField";
import type { Language } from "@shared/database/types/language";

import AdminField from "./AdminField";
import AdminTranslateButton from "./AdminTranslateButton";

type AdminTranslatableFieldProps = {
  id: string;
  label: string;
  hint?: string;
  language: Language;
  children: ReactNode;
  sourceText: string;
  onApply: (translatedText: string) => void;
  disabled?: boolean;
  className?: string;
};

function AdminTranslatableField({
  id,
  label,
  hint,
  language,
  children,
  sourceText,
  onApply,
  disabled = false,
  className,
}: AdminTranslatableFieldProps) {
  const { isOverlayOpen } = useTranslationOverlay();
  const translate = useTranslateField({
    language,
    sourceText,
    disabled: disabled || isOverlayOpen,
    onApply,
  });

  return (
    <AdminField
      id={id}
      label={label}
      hint={translate.error ?? hint}
      className={[className, translate.error ? "admin-field--error" : ""]
        .filter(Boolean)
        .join(" ")}
      action={
        <AdminTranslateButton
          language={language}
          disabled={disabled || isOverlayOpen || translate.isTranslating}
          isLoading={translate.isTranslating}
          onClick={() => void translate.onTranslate()}
        />
      }
    >
      {children}
    </AdminField>
  );
}

export default AdminTranslatableField;
