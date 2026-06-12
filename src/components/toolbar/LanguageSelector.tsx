import type { Language } from "../../types/language";

type LanguageSelectorProps = {
  language: Language;
  onChange: (language: Language) => void;
};

function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  return (
    <div className="pointer-events-auto flex items-center gap-2">
      <button
        type="button"
        className={`min-w-10 text-center ${
          language === "pl" ? "font-bold" : "font-normal"
        }`}
        onClick={() => onChange("pl")}
      >
        PL
      </button>

      <span>/</span>

      <button
        type="button"
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