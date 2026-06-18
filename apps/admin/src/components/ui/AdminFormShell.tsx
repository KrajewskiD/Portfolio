import type { ReactNode } from "react";

import AdminFormFeedback from "@admin/components/ui/AdminFormFeedback";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminPanel from "@admin/components/ui/AdminPanel";

type AdminFormShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  loadError?: string;
  saveError?: string;
  saveSuccess?: boolean;
  extraErrors?: string[];
  panelClassName?: string;
  panelCompact?: boolean;
  children: ReactNode;
};

function AdminFormShell({
  title,
  description,
  actions,
  loadError,
  saveError,
  saveSuccess,
  extraErrors,
  panelClassName,
  panelCompact = false,
  children,
}: AdminFormShellProps) {
  return (
    <section className="admin-stack">
      <AdminFormHeader
        title={title}
        description={description}
        actions={actions}
      />

      <AdminFormFeedback
        loadError={loadError}
        saveError={saveError}
        saveSuccess={saveSuccess}
        extraErrors={extraErrors}
      />

      <AdminPanel className={panelClassName} compact={panelCompact}>
        {children}
      </AdminPanel>
    </section>
  );
}

export default AdminFormShell;
