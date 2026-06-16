type MenuToggleProps = {
  isOpen: boolean;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
};

function MenuToggle({
  isOpen,
  openLabel,
  closeLabel,
  onToggle,
}: MenuToggleProps) {
  return (
    <button
      type="button"
      className="flex h-12 w-12 items-center justify-center sm:hidden"
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
}

export default MenuToggle;
