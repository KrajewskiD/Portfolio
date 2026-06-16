import type { Language } from "@shared/types/language";

import LanguageEditSwitch from "./LanguageEditSwitch";
import AdminButton from "./ui/AdminButton";

type DashboardActionsProps = {
  language: Language;
  isSigningOut: boolean;
  isAutoTranslateDisabled?: boolean;
  onLanguageChange: (language: Language) => void;
  onAutoTranslate?: () => void;
  onSignOut: () => void;
};

function DashboardActions({
  language,
  isSigningOut,
  isAutoTranslateDisabled = true,
  onLanguageChange,
  onAutoTranslate,
  onSignOut,
}: DashboardActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LanguageEditSwitch value={language} onChange={onLanguageChange} />

      <AdminButton
        type="button"
        variant="secondary"
        disabled={isAutoTranslateDisabled}
        onClick={onAutoTranslate}
      >
        Auto translate
      </AdminButton>

      <AdminButton type="button" onClick={onSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
      </AdminButton>
    </div>
  );
}

export default DashboardActions;
