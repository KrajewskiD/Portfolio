import { forwardRef } from "react";

type MenuToggleProps = {
  isOpen: boolean;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
};

const MenuToggle = forwardRef<HTMLButtonElement, MenuToggleProps>(
  function MenuToggle({ isOpen, openLabel, closeLabel, onToggle }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="site-island__menu-toggle sm:hidden"
        aria-label={isOpen ? closeLabel : openLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={onToggle}
      >
        <span className="flex w-5 flex-col gap-1.5">
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
        </span>
      </button>
    );
  },
);

export default MenuToggle;
