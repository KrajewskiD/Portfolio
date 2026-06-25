import AboutSiteForm from "@admin/forms/AboutSiteForm";
import ProfileForm from "@admin/forms/ProfileForm";
import ProjectsForm from "@admin/forms/ProjectsForm";
import SettingsForm from "@admin/forms/SettingsForm";
import SkillsForm from "@admin/forms/SkillsForm";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { ComponentType } from "react";

type DashboardTabComponent = ComponentType<AdminFormProps>;

type DashboardTabDefinitionConfig = {
  id: string;
  label: string;
  placement: "main" | "toolbar";
  Form: DashboardTabComponent;
};

export const dashboardTabDefinitions = [
  { id: "profile", label: "Profil", placement: "main", Form: ProfileForm },
  {
    id: "about-site",
    label: "O stronie",
    placement: "main",
    Form: AboutSiteForm,
  },
  { id: "projects", label: "Projekty", placement: "main", Form: ProjectsForm },
  {
    id: "skills",
    label: "Umiejętności",
    placement: "main",
    Form: SkillsForm,
  },
  {
    id: "settings",
    label: "Ustawienia",
    placement: "toolbar",
    Form: SettingsForm,
  },
] as const satisfies readonly DashboardTabDefinitionConfig[];

type DashboardTabDefinition = (typeof dashboardTabDefinitions)[number];
type DashboardMainTabDefinition = Extract<
  DashboardTabDefinition,
  { placement: "main" }
>;

export type DashboardTabId = DashboardTabDefinition["id"];
export type DashboardContentTabId = DashboardMainTabDefinition["id"];

export const dashboardTabs = dashboardTabDefinitions
  .filter((tab): tab is DashboardMainTabDefinition => tab.placement === "main")
  .map(({ id, label }) => ({ id, label }));

export function getDashboardForm(
  tabId: DashboardTabId,
): DashboardTabComponent | undefined {
  return dashboardTabDefinitions.find((tab) => tab.id === tabId)?.Form;
}
