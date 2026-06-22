import AdminTranslationOverlay from "@admin/components/ui/AdminTranslationOverlay";
import { AdminFormGuardProvider } from "@admin/context/AdminFormGuardProvider";
import { TranslationOverlayProvider } from "@admin/context/TranslationOverlayProvider";
import { useDashboardPage } from "@admin/hooks/useDashboardPage";
import DashboardActions from "../components/DashboardActions";
import DashboardTabs from "../components/DashboardTabs";
import ProfileForm from "../forms/ProfileForm";
import ProjectsForm from "../forms/ProjectsForm";
import SettingsForm from "../forms/SettingsForm";
import SkillsForm from "../forms/SkillsForm";
import AdminLayout from "../layouts/AdminLayout";

function DashboardPageContent() {
  const {
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
  } = useDashboardPage();

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
