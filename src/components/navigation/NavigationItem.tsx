type NavigationItemProps = {
  label: string;
  href: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

function NavigationItem({
  label,
  href,
  mobile = false,
  onNavigate,
}: NavigationItemProps) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={mobile
  ? "block rounded-lg px-3 py-2 text-base hover:bg-black/5"
  : "px-3 py-2"}
      
    >
      {label}
    </a>
  );
}

export default NavigationItem;
