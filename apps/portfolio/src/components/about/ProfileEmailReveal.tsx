import copyIcon from "@shared/assets/icons/copy.svg";

import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";

type ProfileEmailRevealProps = {
  panelState: EmailPanelState;
  email: string | null;
  copyEmailLabel: string;
  emailCopiedMessage: string;
  emailEmptyMessage: string;
  emailLoadErrorMessage: string;
  isCopied: boolean;
  onCopyEmail: () => void;
};

function ProfileEmailReveal({
  panelState,
  email,
  copyEmailLabel,
  emailCopiedMessage,
  emailEmptyMessage,
  emailLoadErrorMessage,
  isCopied,
  onCopyEmail,
}: ProfileEmailRevealProps) {
  if (panelState === "hidden" || panelState === "loading") {
    return null;
  }

  const panelMessage =
    panelState === "empty"
      ? emailEmptyMessage
      : panelState === "error"
        ? emailLoadErrorMessage
        : null;

  return (
    <div className="site-hero-email-reveal">
      <div
        className="site-hero-email-reveal__field"
        aria-live="polite"
      >
        {panelState === "success" && email ? (
          <>
            <span className="site-hero-email-reveal__value">{email}</span>

            <button
              type="button"
              className="site-hero-email-reveal__copy"
              aria-label={copyEmailLabel}
              onClick={onCopyEmail}
            >
              <img
                src={copyIcon}
                alt=""
                aria-hidden
                className="site-hero-email-reveal__copy-icon"
              />
            </button>
          </>
        ) : (
          <span className="site-hero-email-reveal__message">{panelMessage}</span>
        )}
      </div>

      {isCopied ? (
        <span className="site-hero-email-reveal__copy-toast" role="status">
          {emailCopiedMessage}
        </span>
      ) : null}
    </div>
  );
}

export default ProfileEmailReveal;
