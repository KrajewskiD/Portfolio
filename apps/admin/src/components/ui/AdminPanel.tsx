import type { ReactNode } from "react";

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

function AdminPanel({
  children,
  className = "",
  compact = false,
}: AdminPanelProps) {
  return (
    <div
      className={[
        "admin-panel admin-stack",
        compact ? "admin-panel--compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default AdminPanel;
