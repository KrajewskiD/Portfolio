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
        className={[
          "site-island__menu-toggle sm:hidden",
          isOpen ? "site-island__menu-toggle--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={isOpen ? closeLabel : openLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={onToggle}
      >
        <span className="site-island__menu-toggle-lines" aria-hidden>
          <span className="site-island__menu-toggle-line site-island__menu-toggle-line--top" />
          <span className="site-island__menu-toggle-line site-island__menu-toggle-line--middle" />
          <span className="site-island__menu-toggle-line site-island__menu-toggle-line--bottom" />
        </span>
      </button>
    );
  },
);

export default MenuToggle;
