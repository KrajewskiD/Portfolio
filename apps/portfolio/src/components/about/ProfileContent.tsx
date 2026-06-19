import type { ReactNode } from "react";

import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";

import ProfileSocialLinks from "./ProfileSocialLinks";
import type { FooterLinkData } from "@shared/database/types/link";

type ProfileContentProps = {
  name: string;
  role: string;
  label: string;
  links?: FooterLinkData[];
  socialLinksLabel: string;
  emailLabel: string;
  copyEmailLabel: string;
  emailCopiedMessage: string;
  emailEmptyMessage: string;
  emailLoadErrorMessage: string;
  panelState: EmailPanelState;
  email: string | null;
  isCopied: boolean;
  isMailExpanded: boolean;
  isMailLoading: boolean;
  onMailClick: () => void;
  onCopyEmail: () => void;
  children: ReactNode;
};

function ProfileContent({
  name,
  role,
  label,
  links,
  socialLinksLabel,
  emailLabel,
  copyEmailLabel,
  emailCopiedMessage,
  emailEmptyMessage,
  emailLoadErrorMessage,
  panelState,
  email,
  isCopied,
  isMailExpanded,
  isMailLoading,
  onMailClick,
  onCopyEmail,
  children,
}: ProfileContentProps) {
  return (
    <div className="site-hero-card__content">
      <p className="site-label">{label}</p>

      <div className="site-hero-card__name-row">
        <h1 className="site-hero-card__name">{name}</h1>

        <ProfileSocialLinks
          links={links}
          socialLinksLabel={socialLinksLabel}
          emailLabel={emailLabel}
          copyEmailLabel={copyEmailLabel}
          emailCopiedMessage={emailCopiedMessage}
          emailEmptyMessage={emailEmptyMessage}
          emailLoadErrorMessage={emailLoadErrorMessage}
          panelState={panelState}
          email={email}
          isCopied={isCopied}
          isMailExpanded={isMailExpanded}
          isMailLoading={isMailLoading}
          onMailClick={onMailClick}
          onCopyEmail={onCopyEmail}
        />
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
