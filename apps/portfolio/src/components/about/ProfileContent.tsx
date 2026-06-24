import type { ReactNode } from "react";

import ProfileSocialLinks, {
  type ProfileSocialLinksProps,
} from "./ProfileSocialLinks";

type ProfileContentProps = ProfileSocialLinksProps & {
  name: string;
  role: string;
  label: string;
  children: ReactNode;
};

function ProfileContent({
  name,
  role,
  label,
  children,
  ...socialLinksProps
}: ProfileContentProps) {
  return (
    <div className="site-hero-card__panel">
      <ProfileSocialLinks {...socialLinksProps} />

      <p className="site-label site-hero-card__label">{label}</p>

      <div className="site-hero-card__name-row">
        <h1 className="site-hero-card__name">{name}</h1>
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
