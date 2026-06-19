type NavigationItemProps = {
  label: string;
  href: string;
  mobile?: boolean;
  isActive?: boolean;
  onNavigate?: () => void;
};

function NavigationItem({
  label,
  href,
  mobile = false,
  isActive = false,
  onNavigate,
}: NavigationItemProps) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "true" : undefined}
      className={[
        mobile ? "site-nav-link--mobile" : "site-nav-link",
        isActive ? "site-nav-link--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </a>
  );
}

export default NavigationItem;
