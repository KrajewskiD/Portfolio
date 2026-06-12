import type { ReactNode } from "react";

type FooterLinksGroupProps = {
  children: ReactNode;
};

function FooterLinksGroup({ children }: FooterLinksGroupProps) {
  return (
    <nav
      aria-label="Media społecznościowe"
      className="flex flex-row items-center gap-4"
    >
      {children}
    </nav>
  );
}

export default FooterLinksGroup;