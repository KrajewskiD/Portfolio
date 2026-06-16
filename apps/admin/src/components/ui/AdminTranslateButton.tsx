import type { Language } from "@shared/types/language";

import AdminButton from "./AdminButton";

type AdminTranslateButtonProps = {
  language: Language;
  disabled?: boolean;
  onClick?: () => void;
};

function AdminTranslateButton({
  language,
  disabled = true,
  onClick,
}: AdminTranslateButtonProps) {
  const label = language === "pl" ? "PLN -> ENG" : "ENG -> PLN";

  return (
    <AdminButton
      type="button"
      variant="secondary"
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 text-sm"
    >
      {label}
    </AdminButton>
  );
}

export default AdminTranslateButton;