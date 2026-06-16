import type { ReactNode } from "react";

type AdminFormActionsProps = {
  children: ReactNode;
};

function AdminFormActions({ children }: AdminFormActionsProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
  );
}

export default AdminFormActions;
