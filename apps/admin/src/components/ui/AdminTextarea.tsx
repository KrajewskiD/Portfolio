import type { TextareaHTMLAttributes } from "react";

type AdminTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

function AdminTextarea({ className = "", ...props }: AdminTextareaProps) {
  return (
    <textarea {...props} className={["admin-textarea", className].join(" ")} />
  );
}

export default AdminTextarea;
