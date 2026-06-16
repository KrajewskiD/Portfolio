import type { SelectHTMLAttributes } from "react";

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

function AdminSelect({ className = "", ...props }: AdminSelectProps) {
  return (
    <select {...props} className={["admin-select", className].join(" ")} />
  );
}

export default AdminSelect;
