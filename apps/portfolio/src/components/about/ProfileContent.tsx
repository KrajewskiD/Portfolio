import type { ReactNode } from "react";

import FooterLink from "../footer/FooterLink";
import type { FooterLinkData } from "@shared/database/types/link";

type ProfileContentProps = {
  name: string;
  role: string;
  label: string;
  links?: FooterLinkData[];
  socialLinksLabel: string;
  children: ReactNode;
};

function ProfileContent({
  name,
  role,
  label,
  links,
  socialLinksLabel,
  children,
}: ProfileContentProps) {
  return (
    <div className="site-hero-card__content">
      <p className="site-label">{label}</p>

      <div className="site-hero-card__name-row">
        <h1 className="site-hero-card__name">{name}</h1>

        {links && links.length > 0 ? (
          <nav aria-label={socialLinksLabel} className="site-hero-card__links">
            {links.map((link) => (
              <FooterLink key={link.id} label={link.label} href={link.href} />
            ))}
          </nav>
        ) : null}
      </div>

      {role ? (
        <div className="site-hero-card__role-row">
          <span aria-hidden className="site-hero-card__rule" />
          <p className="site-hero-card__role">{role}</p>
        </div>
      ) : null}

      <div className="site-body site-hero-card__description">{children}</div>
    </div>
  );
}

export default ProfileContent;
