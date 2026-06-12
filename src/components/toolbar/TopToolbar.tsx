import type { Language } from "../../types/language";
import Clock from "./Clock";

type TopToolbarProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

function TopToolbar({
  language,
  onLanguageChange,
}: TopToolbarProps) {

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex h-12 items-center justify-end px-4 text-lg leading-none sm:justify-between sm:px-6">
        <Clock />

        <div className="pointer-events-auto flex items-center gap-2">
        <button
            type="button"
            className={`min-w-10 text-center ${ language === "pl" ? "font-bold" : "font-normal" }`}
            aria-pressed={language === "pl"}
            onClick={() => onLanguageChange("pl")}
        >
            PL
        </button>

        <span>/</span>

        <button
            type="button"
            className={`min-w-10 text-center ${language === "en" ? "font-bold" : "font-normal"}`}
            
            aria-pressed={language === "en"}
            onClick={() => onLanguageChange("en")}
        >
            ENG
        </button>
        </div>
    </div>
  );
}

export default TopToolbar;