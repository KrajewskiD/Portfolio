import type { ButtonHTMLAttributes, ReactNode } from "react";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function AuthButton({ children, className = "", ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      className={[
        "cursor-pointer rounded-full border border-white/20 bg-neutral-800 px-5 py-3 font-bold text-white transition",
        "hover:border-white/30 hover:bg-neutral-700",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default AuthButton;
