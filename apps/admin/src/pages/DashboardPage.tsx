import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import DashboardTabs from "../components/DashboardTabs";
import FooterLinksForm from "../forms/FooterLinksForm";
import ProfileForm from "../forms/ProfileForm";
import ProjectsForm from "../forms/ProjectsForm";
import SkillsForm from "../forms/SkillsForm";
import AdminLayout from "../layouts/AdminLayout";
import { signOut } from "../services/authService";

type DashboardTabId = "profile" | "projects" | "skills" | "footer";

const dashboardTabs: Array<{ id: DashboardTabId; label: string }> = [
  { id: "profile", label: "Profil" },
  { id: "projects", label: "Projekty" },
  { id: "skills", label: "Umiejętności" },
  { id: "footer", label: "Footer" },
];

function DashboardPage() {
  const [activeTabId, setActiveTabId] = useState<DashboardTabId>("profile");
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
    switch (activeTabId) {
      case "profile":
        return <ProfileForm />;
      case "projects":
        return <ProjectsForm />;
      case "skills":
        return <SkillsForm />;
      case "footer":
        return <FooterLinksForm />;
    }
  }

  return (
    <AdminLayout
      title="Panel administratora"
      actions={
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cursor-pointer rounded-full border border-white/20 bg-neutral-800 px-5 py-3 font-bold text-white transition hover:border-white/30 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
        </button>
      }
    >
      <DashboardTabs
        tabs={dashboardTabs}
        activeTabId={activeTabId}
        onChange={(tabId) => setActiveTabId(tabId as DashboardTabId)}
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