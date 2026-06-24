import type { FooterLinkData } from "@shared/database/types/link";

import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";

import ProfileEmailAction from "./ProfileEmailAction";
import ProfileLink from "./ProfileLink";

export type ProfileSocialLinksProps = {
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
};

function ProfileSocialLinks({
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
}: ProfileSocialLinksProps) {
  return (
    <div className="site-hero-card__social site-social-icon-scale">
      <nav aria-label={socialLinksLabel} className="site-hero-card__links">
        <ProfileEmailAction
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
          align="right"
          direction="bottom"
          panelOffsetX="-64px"
          panelOffsetY="-4px"
          size="1.28em"
          onMailClick={onMailClick}
          onCopyEmail={onCopyEmail}
        />

        {links?.map((link) => (
          <ProfileLink key={link.id} label={link.label} href={link.href} />
        ))}
      </nav>
    </div>
  );
}

export default ProfileSocialLinks;
