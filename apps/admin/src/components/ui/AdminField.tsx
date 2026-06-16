import type { ReactNode } from "react";

type AdminFieldProps = {
  id: string;
  label: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
};

function AdminField({ id, label, hint, action, children }: AdminFieldProps) {
  return (
    <div className="admin-field">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="admin-label">
          {label}
        </label>

        {action}
      </div>

      {children}

      {hint ? <p className="admin-hint">{hint}</p> : null}
    </div>
  );
}

export default AdminField;