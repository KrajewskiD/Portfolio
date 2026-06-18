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
      className="site-island__menu-panel sm:hidden"
    >
      {children}
    </nav>
  );
}

export default MobileNavigation;
