import type { DashboardTabId } from "@admin/config/dashboardTabs";
import AdminSegmentedControl from "@admin/components/ui/AdminSegmentedControl";

type DashboardTab = {
  id: DashboardTabId;
  label: string;
};

type DashboardTabsProps = {
  tabs: DashboardTab[];
  activeTabId: DashboardTabId;
  onChange: (tabId: DashboardTabId) => void;
};

function DashboardTabs({ tabs, activeTabId, onChange }: DashboardTabsProps) {
  return (
    <AdminSegmentedControl
      items={tabs}
      activeId={activeTabId}
      onChange={onChange}
    />
  );
}

export default DashboardTabs;
