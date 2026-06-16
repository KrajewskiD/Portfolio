import type { Language } from "@shared/types/language";

type AdminTranslateButtonProps = {
  language: Language;
  disabled?: boolean;
  onClick?: () => void;
};

function AdminTranslateButton({
  language,
  disabled = false,
  onClick,
}: AdminTranslateButtonProps) {
  const label = language === "pl" ? "PL → ENG" : "ENG → PL";

  return (
    <button
      type="button"
      className="admin-translate-button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={onClick ? label : `${label} (wkrótce)`}
    >
      {label}
    </button>
  );
}

export default AdminTranslateButton;
