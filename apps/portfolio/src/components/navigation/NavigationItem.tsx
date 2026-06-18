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
      className={mobile ? "site-nav-link--mobile" : "site-nav-link"}
    >
      {label}
    </a>
  );
}

export default NavigationItem;
