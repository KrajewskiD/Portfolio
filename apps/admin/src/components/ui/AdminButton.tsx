import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AdminButtonVariant;
};

function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: AdminButtonProps) {
  return (
    <button
      {...props}
      className={["admin-button", `admin-button-${variant}`, className].join(
        " ",
      )}
    >
      {children}
    </button>
  );
}

export default AdminButton;
