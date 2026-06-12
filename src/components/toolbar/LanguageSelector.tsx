import type { Language } from "../../types/language";

type LanguageSelectorProps = {
  language: Language;
  onChange: (language: Language) => void;
};

function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <div className="pointer-events-auto flex items-center gap-2">
      <button
        type="button"
        lang="pl"
        aria-pressed={language === "pl"}
        className={`min-w-10 text-center ${
          language === "pl" ? "font-bold" : "font-normal"
        }`}
        onClick={() => onChange("pl")}
      >
        PL
      </button>

      <span aria-hidden="true">/</span>

      <button
        type="button"
        lang="en"
        aria-pressed={language === "en"}
        className={`min-w-10 text-center ${
          language === "en" ? "font-bold" : "font-normal"
        }`}
        onClick={() => onChange("en")}
      >
        ENG
      </button>
    </div>
  );
}

export default LanguageSelector;
