import { useCallback, useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import { useAdminFormGuard } from "@admin/context/useAdminFormGuard";
import { useGuardedNavigation } from "@admin/hooks/useGuardedNavigation";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  dashboardTabs,
  type DashboardTabId,
} from "@admin/config/dashboardTabs";
import { signOut } from "@admin/services/authService";
import type { Language } from "@shared/database/types/language";

export function useDashboardPage() {
  const { confirmNavigation } = useAdminFormGuard();
  const guarded = useGuardedNavigation(confirmNavigation);
  const { overlayState, isOverlayOpen, cancelTranslation, dismissTranslation } =
    useTranslationOverlay();
  const [activeTabId, setActiveTabId] = useState<DashboardTabId>("profile");
  const [editLanguage, setEditLanguage] = useState<Language>("pl");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleTabChange = guarded(
    (nextTabId: DashboardTabId) => {
      setActiveTabId(nextTabId);
    },
    (nextTabId) => nextTabId !== activeTabId,
  );

  const handleLanguageChange = guarded(
    (nextLanguage: Language) => {
      setEditLanguage(nextLanguage);
    },
    (nextLanguage) => nextLanguage !== editLanguage,
  );

  const handleSignOut = useCallback(async () => {
    const canNavigate = await confirmNavigation();

    if (!canNavigate) {
      return;
    }

    setIsSigningOut(true);
    setErrorMessage(undefined);

    try {
      await signOut();
      window.location.replace(getAdminUrl(adminRoute.login));
    } catch {
      setErrorMessage("Nie udało się wylogować. Spróbuj ponownie.");
      setIsSigningOut(false);
    }
  }, [confirmNavigation]);

  return {
    activeTabId,
    editLanguage,
    isSigningOut,
    errorMessage,
    isOverlayOpen,
    overlayState,
    dashboardTabs,
    handleTabChange,
    handleLanguageChange,
    handleSignOut,
    cancelTranslation,
    dismissTranslation,
  };
}
