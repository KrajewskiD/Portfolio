import type { Language } from "../../types/language";
import Clock from "./Clock";
import LanguageSelector from "./LanguageSelector";

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

      <LanguageSelector
        language={language}
        onChange={onLanguageChange}
      />
    </div>
  );
}

export default TopToolbar;