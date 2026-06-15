import type { ReactNode } from "react";

type MobileNavigationProps = {
  label: string;
  children: ReactNode;
};

function MobileNavigation({ label, children }: MobileNavigationProps) {
  return (
    <nav
      id="mobile-menu"
      aria-label={label}
      className="absolute top-full left-0 mt-2 w-48 rounded-xl border bg-white p-2 shadow-sm sm:hidden"
    >
      {children}
    </nav>
  );
}

export default MobileNavigation;
