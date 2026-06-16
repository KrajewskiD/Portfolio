import type { ReactNode } from "react";

type AdminFieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
};

function AdminField({ id, label, hint, children }: AdminFieldProps) {
  return (
    <div className="admin-field">
      <label htmlFor={id} className="admin-label">
        {label}
      </label>

      {children}

      {hint && <p className="admin-hint">{hint}</p>}
    </div>
  );
}

export default AdminField;
