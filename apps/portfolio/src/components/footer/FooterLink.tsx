type FooterLinkProps = {
  label: string;
  href: string;
};

function FooterLink({ label, href }: FooterLinkProps) {
  return (
    <a
      href={href}
      className="site-pill--link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export default FooterLink;
