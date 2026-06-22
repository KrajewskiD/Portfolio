type IconLinkButtonProps = {
  href: string;
  label: string;
  iconSrc: string;
  className?: string;
};

function IconLinkButton({
  href,
  label,
  iconSrc,
  className = "",
}: IconLinkButtonProps) {
  return (
    <a
      href={href}
      className={["site-icon-link", className].filter(Boolean).join(" ")}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.stopPropagation();

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <img src={iconSrc} alt="" aria-hidden className="site-icon-link__icon" />
    </a>
  );
}

export default IconLinkButton;
