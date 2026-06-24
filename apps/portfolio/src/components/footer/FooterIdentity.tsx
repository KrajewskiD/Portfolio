import ProfileEmailAction from "@portfolio/components/about/ProfileEmailAction";
import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";

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
  isMailExpanded: boolean;
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
  isMailExpanded,
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

          <ProfileEmailAction
            className="site-footer__email-action"
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
            direction="right"
            size="2.625rem"
            onMailClick={onMailClick}
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
