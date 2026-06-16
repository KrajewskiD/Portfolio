import type { ReactNode } from "react";

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
};

function AdminPanel({ children, className = "" }: AdminPanelProps) {
  return (
    <div className={["admin-panel admin-stack", className].join(" ")}>
      {children}
    </div>
  );
}

export default AdminPanel;
