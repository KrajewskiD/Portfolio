import type { ReactNode } from "react";

type MobileNavigationProps = {
  children: ReactNode;
};

function MobileNavigation({
  children,
}: MobileNavigationProps) {
  return (
    <nav
      id="mobile-menu"
      aria-label="Mobilna nawigacja"
      className="absolute top-full left-1/2 mt-2 w-56 -translate-x-1/2 rounded-2xl border bg-white p-2 sm:hidden"
    >
      {children}
    </nav>
  );
}

export default MobileNavigation;