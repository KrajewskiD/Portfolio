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
  const handleSelect = (nextLanguage: Language) => {
    if (nextLanguage === language) {
      return;
    }

    onChange(nextLanguage);
  };

  return (
    <div
      className={["site-lang-toggle", className].filter(Boolean).join(" ")}
      data-active={language}
      role="group"
      aria-label="Language"
    >
      <span
        aria-hidden
        className="site-lang-toggle__indicator"
        data-position={language}
      />

      <button
        type="button"
        lang="pl"
        aria-pressed={language === "pl"}
        className={`site-lang-button ${
          language === "pl"
            ? "site-lang-button--active"
            : "site-lang-button--inactive"
        }`}
        onClick={() => handleSelect("pl")}
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
        onClick={() => handleSelect("en")}
      >
        ENG
      </button>
    </div>
  );
}

export default LanguageSelector;
