import mailIcon from "@shared/assets/icons/mail.svg";
import type { FooterLinkData } from "@shared/database/types/link";

import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";

import ProfileEmailReveal from "./ProfileEmailReveal";
import ProfileLink from "./ProfileLink";
import ProfileMailLoadingDots from "./ProfileMailLoadingDots";

type ProfileSocialLinksProps = {
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
    <div className="site-hero-card__social">
      <nav aria-label={socialLinksLabel} className="site-hero-card__links">
        <button
          type="button"
          className={`site-hero-card__link site-hero-card__link--icon${
            isMailLoading ? " site-hero-card__link--icon--loading" : ""
          }`}
          aria-label={emailLabel}
          aria-busy={isMailLoading}
          aria-expanded={isMailExpanded}
          disabled={isMailLoading}
          onClick={onMailClick}
        >
          {isMailLoading ? (
            <ProfileMailLoadingDots />
          ) : (
            <img
              src={mailIcon}
              alt=""
              aria-hidden
              className="site-hero-card__link-icon"
            />
          )}
        </button>

        {links?.map((link) => (
          <ProfileLink key={link.id} label={link.label} href={link.href} />
        ))}
      </nav>

      <ProfileEmailReveal
        panelState={panelState}
        email={email}
        copyEmailLabel={copyEmailLabel}
        emailCopiedMessage={emailCopiedMessage}
        emailEmptyMessage={emailEmptyMessage}
        emailLoadErrorMessage={emailLoadErrorMessage}
        isCopied={isCopied}
        onCopyEmail={onCopyEmail}
      />
    </div>
  );
}

export default ProfileSocialLinks;
