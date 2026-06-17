import { forwardRef, type InputHTMLAttributes } from "react";

type AdminInputProps = InputHTMLAttributes<HTMLInputElement>;

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  function AdminInput({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={["admin-input", className].join(" ")}
      />
    );
  },
);

export default AdminInput;
