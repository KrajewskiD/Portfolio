import type { InputHTMLAttributes } from "react";

type AdminInputProps = InputHTMLAttributes<HTMLInputElement>;

function AdminInput({ className = "", ...props }: AdminInputProps) {
  return <input {...props} className={["admin-input", className].join(" ")} />;
}

export default AdminInput;
