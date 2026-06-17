import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  bordered?: boolean;
  children: ReactNode;
};

function SettingsSection({
  title,
  description,
  action,
  bordered = false,
  children,
}: SettingsSectionProps) {
  return (
    <div
      className={[
        "admin-stack",
        bordered ? "border-t border-white/10 pt-6" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="admin-stack">
          <h3 className="admin-section-title">{title}</h3>
          {description ? (
            <p className="text-sm text-white/40">{description}</p>
          ) : null}
        </div>
        {action}
      </div>

      {children}
    </div>
  );
}

export default SettingsSection;
