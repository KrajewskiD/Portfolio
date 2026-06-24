import type { CSSProperties } from "react";

import mailIcon from "@shared/assets/icons/mail.svg";
import type { EmailPanelState } from "@portfolio/hooks/useProfileEmailReveal";

import ProfileEmailReveal from "./ProfileEmailReveal";
import ProfileMailLoadingDots from "./ProfileMailLoadingDots";

export type ProfileEmailRevealDirection = "bottom" | "left" | "right";
export type ProfileEmailRevealAlign = "center" | "left" | "right";

type ProfileEmailActionProps = {
  align?: ProfileEmailRevealAlign;
  copyEmailLabel: string;
  direction?: ProfileEmailRevealDirection;
  email: string | null;
  emailCopiedMessage: string;
  emailEmptyMessage: string;
  emailLabel: string;
  emailLoadErrorMessage: string;
  isCopied: boolean;
  isMailExpanded: boolean;
  isMailLoading: boolean;
  panelOffsetX?: string;
  panelOffsetY?: string;
  panelState: EmailPanelState;
  size?: string;
  className?: string;
  onCopyEmail: () => void;
  onMailClick: () => void;
};

function ProfileEmailAction({
  align = "right",
  className,
  copyEmailLabel,
  direction = "left",
  email,
  emailCopiedMessage,
  emailEmptyMessage,
  emailLabel,
  emailLoadErrorMessage,
  isCopied,
  isMailExpanded,
  isMailLoading,
  panelOffsetX = "0px",
  panelOffsetY = "0px",
  panelState,
  size = "1.28em",
  onCopyEmail,
  onMailClick,
}: ProfileEmailActionProps) {
  const rootStyle = {
    "--profile-email-action-size": size,
    "--profile-email-panel-offset-x": panelOffsetX,
    "--profile-email-panel-offset-y": panelOffsetY,
  } as CSSProperties;

  const rootClassName = [
    "site-profile-email-action",
    `site-profile-email-action--direction-${direction}`,
    `site-profile-email-action--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} style={rootStyle}>
      <button
        type="button"
        className={`site-profile-email-action__button site-icon-link${
          isMailLoading ? " site-icon-link--loading" : ""
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
            className="site-profile-email-action__icon site-icon-link__icon"
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
  );
}

export default ProfileEmailAction;
