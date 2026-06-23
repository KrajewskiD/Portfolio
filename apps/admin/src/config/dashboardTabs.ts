export type DashboardTabId =
  | "profile"
  | "about-site"
  | "projects"
  | "skills"
  | "settings";

export type DashboardContentTabId = Exclude<DashboardTabId, "settings">;

export const dashboardTabs: Array<{
  id: DashboardContentTabId;
  label: string;
}> = [
  { id: "profile", label: "Profil" },
  { id: "about-site", label: "O stronie" },
  { id: "projects", label: "Projekty" },
  { id: "skills", label: "Umiejętności" },
];
