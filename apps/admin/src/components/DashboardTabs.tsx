import type {
  DashboardContentTabId,
  DashboardTabId,
} from "@admin/config/dashboardTabs";
import AdminSegmentedControl from "@admin/components/ui/AdminSegmentedControl";
import featuresIcon from "@shared/assets/icons/features.svg";

type DashboardTab = {
  id: DashboardContentTabId;
  label: string;
};

type DashboardTabsProps = {
  tabs: DashboardTab[];
  activeTabId: DashboardTabId;
  isNavigationLocked?: boolean;
  onChange: (tabId: DashboardTabId) => void;
};

function DashboardTabs({
  tabs,
  activeTabId,
  isNavigationLocked = false,
  onChange,
}: DashboardTabsProps) {
  const isSettingsActive = activeTabId === "settings";

  return (
    <div className="flex w-full max-w-full items-center gap-3 border-b border-white/10 pb-4">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <AdminSegmentedControl
          items={tabs}
          activeId={isSettingsActive ? undefined : activeTabId}
          disabled={isNavigationLocked}
          onChange={onChange}
          borderless
        />
      </div>

      <button
        type="button"
        onClick={() => onChange("settings")}
        disabled={isNavigationLocked}
        aria-label="Ustawienia"
        title="Ustawienia"
        className={[
          "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition",
          isNavigationLocked ? "cursor-not-allowed opacity-40" : "",
          isSettingsActive
            ? "border-white/30 bg-neutral-700 text-white"
            : "border-white/10 bg-neutral-800 text-white/60 hover:border-white/20 hover:bg-neutral-700 hover:text-white",
        ].join(" ")}
      >
        <img
          src={featuresIcon}
          alt=""
          aria-hidden
          className={[
            "h-5 w-5 brightness-0 invert",
            isSettingsActive ? "opacity-100" : "opacity-70",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default DashboardTabs;
