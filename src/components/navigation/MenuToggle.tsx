type MenuToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function MenuToggle({
  isOpen,
  onToggle,
}: MenuToggleProps) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center sm:hidden"
      aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
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
}

export default MenuToggle;