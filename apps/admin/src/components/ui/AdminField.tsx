import type { ReactNode } from "react";

type AdminFieldProps = {
  id: string;
  label: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  groupLabel?: boolean;
};

function AdminField({
  id,
  label,
  hint,
  action,
  children,
  className = "",
  groupLabel = false,
}: AdminFieldProps) {
  const labelId = `${id}-label`;

  return (
    <div className={["admin-field", className].filter(Boolean).join(" ")}>
      {groupLabel ? (
        <p id={labelId} className="admin-label">
          {label}
        </p>
      ) : (
        <div className="admin-field__header">
          <label htmlFor={id} className="admin-label">
            {label}
          </label>

          {action}
        </div>
      )}

      {hint ? <p className="admin-hint">{hint}</p> : null}

      {children}
    </div>
  );
}

export default AdminField;
