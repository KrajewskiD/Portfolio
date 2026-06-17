import type { ReactNode } from "react";

type AdminEmptyMessageProps = {
  children: ReactNode;
  className?: string;
  inline?: boolean;
};

function AdminEmptyMessage({
  children,
  className = "",
  inline = false,
}: AdminEmptyMessageProps) {
  if (inline) {
    return (
      <p
        className={["admin-empty-message", className].filter(Boolean).join(" ")}
      >
        {children}
      </p>
    );
  }

  return (
    <div className={["admin-empty-panel", className].filter(Boolean).join(" ")}>
      <p className="admin-empty-message">{children}</p>
    </div>
  );
}

export default AdminEmptyMessage;
