export type DashboardTabId = "profile" | "projects" | "skills" | "footer";

export const dashboardTabs: Array<{ id: DashboardTabId; label: string }> = [
  { id: "profile", label: "Profil" },
  { id: "projects", label: "Projekty" },
  { id: "skills", label: "Umiejętności" },
  { id: "footer", label: "Footer" },
];
