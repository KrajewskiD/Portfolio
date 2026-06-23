import type { Language } from "@shared/database/types/language";

type LanguageSelectorProps = {
  language: Language;
  className?: string;
  onChange: (language: Language) => void;
};

function LanguageSelector({
  language,
  className = "",
  onChange,
}: LanguageSelectorProps) {
  return (
    <div
      className={["site-lang-toggle", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        lang="pl"
        aria-pressed={language === "pl"}
        className={`site-lang-button ${
          language === "pl"
            ? "site-lang-button--active"
            : "site-lang-button--inactive"
        }`}
        onClick={() => onChange("pl")}
      >
        PL
      </button>

      <button
        type="button"
        lang="en"
        aria-pressed={language === "en"}
        className={`site-lang-button ${
          language === "en"
            ? "site-lang-button--active"
            : "site-lang-button--inactive"
        }`}
        onClick={() => onChange("en")}
      >
        ENG
      </button>
    </div>
  );
}

export default LanguageSelector;
