type FooterLinkProps = {
  label: string;
  href: string;
};

function FooterLink({ label, href }: FooterLinkProps) {
  return (
    <a href={href} className="site-pill--link">
      {label}
    </a>
  );
}

export default FooterLink;
