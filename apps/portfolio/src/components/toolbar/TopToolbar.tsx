import type { Language } from "@shared/database/types/language";
import Clock from "./Clock";
import LanguageSelector from "./LanguageSelector";

type TopToolbarProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

function TopToolbar({ language, onLanguageChange }: TopToolbarProps) {
  return (
    <div className="site-toolbar">
      <Clock />

      <LanguageSelector language={language} onChange={onLanguageChange} />
    </div>
  );
}

export default TopToolbar;
