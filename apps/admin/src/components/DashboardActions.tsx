import type { Language } from "@shared/database/types/language";

import LanguageEditSwitch from "./LanguageEditSwitch";
import AdminButton from "./ui/AdminButton";

type DashboardActionsProps = {
  language: Language;
  isSigningOut: boolean;
  isNavigationLocked?: boolean;
  onLanguageChange: (language: Language) => void;
  onSignOut: () => void;
};

function DashboardActions({
  language,
  isSigningOut,
  isNavigationLocked = false,
  onLanguageChange,
  onSignOut,
}: DashboardActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LanguageEditSwitch
        value={language}
        disabled={isNavigationLocked || isSigningOut}
        onChange={onLanguageChange}
      />

      <AdminButton
        type="button"
        onClick={onSignOut}
        disabled={isSigningOut || isNavigationLocked}
      >
        {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
      </AdminButton>
    </div>
  );
}

export default DashboardActions;
