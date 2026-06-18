import type { ReactNode } from "react";

type NavigationLinksProps = {
  children: ReactNode;
  mobile?: boolean;
  className?: string;
};

function NavigationLinks({
  children,
  mobile = false,
  className = "",
}: NavigationLinksProps) {
  const baseClass = mobile
    ? "flex flex-col"
    : "hidden items-center gap-0.5 sm:flex";

  return <div className={`${baseClass} ${className}`.trim()}>{children}</div>;
}

export default NavigationLinks;
