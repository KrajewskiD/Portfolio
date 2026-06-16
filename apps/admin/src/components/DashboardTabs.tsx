import type { DashboardTabId } from "../config/dashboardTabs";

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
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              "cursor-pointer rounded-full border px-5 py-2 font-bold transition",
              isActive
                ? "border-white/30 bg-neutral-700 text-white"
                : "border-white/10 bg-neutral-800 text-white/60 hover:border-white/20 hover:bg-neutral-700 hover:text-white",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default DashboardTabs;
