export type DashboardTabId =
  | "profile"
  | "projects"
  | "skills"
  | "footer"
  | "settings";

export type DashboardContentTabId = Exclude<DashboardTabId, "settings">;

export const dashboardTabs: Array<{
  id: DashboardContentTabId;
  label: string;
}> = [
  { id: "profile", label: "Profil" },
  { id: "projects", label: "Projekty" },
  { id: "skills", label: "Umiejętności" },
  { id: "footer", label: "Footer" },
];
