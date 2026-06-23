import type { ReactNode } from "react";

type FooterLinksGroupProps = {
  label: string;
  children: ReactNode;
};

function FooterLinksGroup({ label, children }: FooterLinksGroupProps) {
  return (
    <nav aria-label={label} className="site-footer__links">
      {children}
    </nav>
  );
}

export default FooterLinksGroup;
