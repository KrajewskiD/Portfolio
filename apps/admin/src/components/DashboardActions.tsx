import type { Language } from "@shared/types/language";

import LanguageEditSwitch from "./LanguageEditSwitch";
import AdminButton from "./ui/AdminButton";

type DashboardActionsProps = {
  language: Language;
  isSigningOut: boolean;
  onLanguageChange: (language: Language) => void;
  onSignOut: () => void;
};

function DashboardActions({
  language,
  isSigningOut,
  onLanguageChange,
  onSignOut,
}: DashboardActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LanguageEditSwitch value={language} onChange={onLanguageChange} />

      <AdminButton type="button" onClick={onSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
      </AdminButton>
    </div>
  );
}

export default DashboardActions;
