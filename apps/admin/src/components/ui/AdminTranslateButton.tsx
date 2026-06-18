import type { Language } from "@shared/database/types/language";
import { getOppositeLanguage } from "@shared/utils/localizedField";

type AdminTranslateButtonProps = {
  language: Language;
  disabled?: boolean;
  isLoading?: boolean;
  title?: string;
  className?: string;
  onClick?: () => void;
};

function AdminTranslateButton({
  language,
  disabled = false,
  isLoading = false,
  title,
  className = "",
  onClick,
}: AdminTranslateButtonProps) {
  const label =
    getOppositeLanguage(language) === "en" ? "PL → ENG" : "ENG → PL";
  const buttonTitle =
    title ?? (onClick ? "Przetłumacz przez Gemini AI" : `${label} (wkrótce)`);

  return (
    <button
      type="button"
      className={["admin-translate-button", className]
        .filter(Boolean)
        .join(" ")}
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
