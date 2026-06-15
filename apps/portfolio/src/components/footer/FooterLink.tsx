type FooterLinkProps = {
  label: string;
  href: string;
};

function FooterLink({ label, href }: FooterLinkProps) {
  return (
    <a
      href={href}
      className="py-2 text-sm sm:rounded-full sm:border sm:px-5 sm:py-3 sm:text-base"
      target="_blank"
      rel="noreferrer"
    >
      {label} ↗
    </a>
  );
}

export default FooterLink;
