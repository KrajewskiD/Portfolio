import { forwardRef, type ReactNode } from "react";

type MobileNavigationProps = {
  label: string;
  children: ReactNode;
};

const MobileNavigation = forwardRef<HTMLElement, MobileNavigationProps>(
  function MobileNavigation({ label, children }, ref) {
    return (
      <nav
        ref={ref}
        id="mobile-menu"
        aria-label={label}
        className="site-island__menu-panel sm:hidden"
      >
        {children}
      </nav>
    );
  },
);

export default MobileNavigation;
