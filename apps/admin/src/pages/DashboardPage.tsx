import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import AdminTranslationOverlay from "@admin/components/ui/AdminTranslationOverlay";
import { AdminFormGuardProvider } from "@admin/context/AdminFormGuardContext";
import {
  TranslationOverlayProvider,
  useTranslationOverlay,
} from "@admin/context/TranslationOverlayContext";
import { useGuardedNavigation } from "@admin/hooks/useGuardedNavigation";
import DashboardActions from "../components/DashboardActions";
import DashboardTabs from "../components/DashboardTabs";
import type { Language } from "@shared/database/types/language";
import { dashboardTabs, type DashboardTabId } from "../config/dashboardTabs";
import ProfileForm from "../forms/ProfileForm";
import ProjectsForm from "../forms/ProjectsForm";
import SettingsForm from "../forms/SettingsForm";
import SkillsForm from "../forms/SkillsForm";
import AdminLayout from "../layouts/AdminLayout";
import { useAdminFormGuard } from "@admin/context/AdminFormGuardContext";
import { signOut } from "../services/authService";

function DashboardPageContent() {
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

  async function handleSignOut() {
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
  }

  function renderActiveForm() {
    const formProps = {
      language: editLanguage,
    };

    switch (activeTabId) {
      case "profile":
        return <ProfileForm {...formProps} />;
      case "projects":
        return <ProjectsForm {...formProps} />;
      case "skills":
        return <SkillsForm {...formProps} />;
      case "settings":
        return <SettingsForm {...formProps} />;
    }
  }

  return (
    <>
      <AdminLayout
        title="Panel administratora"
        actions={
          <DashboardActions
            language={editLanguage}
            isSigningOut={isSigningOut}
            isNavigationLocked={isOverlayOpen}
            onLanguageChange={(language) => void handleLanguageChange(language)}
            onSignOut={() => void handleSignOut()}
          />
        }
      >
        <DashboardTabs
          tabs={dashboardTabs}
          activeTabId={activeTabId}
          isNavigationLocked={isOverlayOpen}
          onChange={(tabId) => void handleTabChange(tabId)}
        />

        {errorMessage && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        <div className="pt-6">{renderActiveForm()}</div>
      </AdminLayout>

      <AdminTranslationOverlay
        state={overlayState}
        onCancel={cancelTranslation}
        onDismiss={dismissTranslation}
      />
    </>
  );
}

function DashboardPage() {
  return (
    <AdminFormGuardProvider>
      <TranslationOverlayProvider>
        <DashboardPageContent />
      </TranslationOverlayProvider>
    </AdminFormGuardProvider>
  );
}

export default DashboardPage;
