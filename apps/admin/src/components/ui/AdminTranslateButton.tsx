import type { Language } from "@shared/database/types/language";

type AdminTranslateButtonProps = {
  language: Language;
  disabled?: boolean;
  isLoading?: boolean;
  title?: string;
  onClick?: () => void;
};

function AdminTranslateButton({
  language,
  disabled = false,
  isLoading = false,
  title,
  onClick,
}: AdminTranslateButtonProps) {
  const label = language === "pl" ? "PL → ENG" : "ENG → PL";
  const buttonTitle =
    title ?? (onClick ? "Przetłumacz przez Gemini AI" : `${label} (wkrótce)`);

  return (
    <button
      type="button"
      className="admin-translate-button"
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={title ?? label}
      aria-busy={isLoading}
      title={buttonTitle}
    >
      {isLoading ? "…" : label}
    </button>
  );
}

export default AdminTranslateButton;
