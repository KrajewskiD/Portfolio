import ProfileEmailReveal from "@portfolio/components/about/ProfileEmailReveal";
import ProfileMailLoadingDots from "@portfolio/components/about/ProfileMailLoadingDots";
import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";
import mailIcon from "@shared/assets/icons/mail.svg";

type FooterIdentityProps = {
  name: string;
  description: string;
  copyEmailLabel: string;
  email: string | null;
  emailCopiedMessage: string;
  emailEmptyMessage: string;
  emailLabel: string;
  emailLoadErrorMessage: string;
  isCopied: boolean;
  isMailLoading: boolean;
  panelState: EmailPanelState;
  onCopyEmail: () => void;
  onMailClick: () => void;
};

function FooterIdentity({
  name,
  description,
  copyEmailLabel,
  email,
  emailCopiedMessage,
  emailEmptyMessage,
  emailLabel,
  emailLoadErrorMessage,
  isCopied,
  isMailLoading,
  panelState,
  onCopyEmail,
  onMailClick,
}: FooterIdentityProps) {
  return (
    <div className="site-footer__identity">
      {name ? (
        <div className="site-footer__name-row">
          <p className="site-footer__name font-semibold text-foreground">
            {name}
          </p>

          <button
            type="button"
            className="site-footer__mail-button"
            aria-label={emailLabel}
            aria-busy={isMailLoading}
            aria-expanded={panelState !== "hidden"}
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
                className="site-footer__mail-icon"
              />
            )}
          </button>

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
      ) : null}
      {description ? (
        <p className="site-body--compact site-footer__description mt-2 text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default FooterIdentity;
