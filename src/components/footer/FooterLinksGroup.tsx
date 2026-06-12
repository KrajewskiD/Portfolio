import type { ReactNode } from "react";

type FooterLinksGroupProps = {
  label: string;
  children: ReactNode;
};

function FooterLinksGroup({ label, children }: FooterLinksGroupProps) {
  return (
    <nav aria-label={label} className="flex flex-row items-center gap-4">
      {children}
    </nav>
  );
}

export default FooterLinksGroup;
