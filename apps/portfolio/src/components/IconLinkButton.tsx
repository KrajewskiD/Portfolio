type IconLinkButtonProps = {
  href: string;
  label: string;
  iconSrc: string;
  className?: string;
  size?: "default" | "lg";
};

function IconLinkButton({
  href,
  label,
  iconSrc,
  className = "",
  size = "default",
}: IconLinkButtonProps) {
  return (
    <a
      href={href}
      className={[
        "site-icon-link",
        size === "lg" ? "site-icon-link--lg" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={iconSrc} alt="" aria-hidden className="site-icon-link__icon" />
    </a>
  );
}

export default IconLinkButton;
