import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import DashboardActions from "../components/DashboardActions";
import DashboardTabs from "../components/DashboardTabs";
import type { Language } from "@shared/types/language";
import { dashboardTabs, type DashboardTabId } from "../config/dashboardTabs";
import FooterLinksForm from "../forms/FooterLinksForm";
import ProfileForm from "../forms/ProfileForm";
import ProjectsForm from "../forms/ProjectsForm";
import SkillsForm from "../forms/SkillsForm";
import AdminLayout from "../layouts/AdminLayout";
import { signOut } from "../services/authService";

function DashboardPage() {
  const [activeTabId, setActiveTabId] = useState<DashboardTabId>("profile");
  const [editLanguage, setEditLanguage] = useState<Language>("pl");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSignOut() {
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
      case "footer":
        return <FooterLinksForm {...formProps} />;
    }
  }

  return (
    <AdminLayout
      title="Panel administratora"
      actions={
        <DashboardActions
          language={editLanguage}
          isSigningOut={isSigningOut}
          onLanguageChange={setEditLanguage}
          onSignOut={handleSignOut}
        />
      }
    >
      <DashboardTabs
        tabs={dashboardTabs}
        activeTabId={activeTabId}
        onChange={setActiveTabId}
      />

      {errorMessage && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="pt-6">{renderActiveForm()}</div>
    </AdminLayout>
  );
}

export default DashboardPage;
