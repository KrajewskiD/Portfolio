import { useCallback, useRef, useState } from "react";

import infoIcon from "@shared/assets/icons/info.svg";

import SiteInfoReveal from "@portfolio/components/SiteInfoReveal";
import useDismissOnOutsidePointerDown from "@portfolio/hooks/useDismissOnOutsidePointerDown";

type HeaderInfoButtonProps = {
  title: string;
  text: string;
  emptyMessage: string;
};

function HeaderInfoButton({
  title,
  text,
  emptyMessage,
}: HeaderInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useDismissOnOutsidePointerDown(isOpen, close, rootRef, buttonRef);

  return (
    <div ref={rootRef} className="site-chrome-info site-social-icon-scale">
      <button
        ref={buttonRef}
        type="button"
        className="site-chrome-info__trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="site-chrome-info__label">{title}</span>

        <span className="site-icon-link site-chrome-info__icon" aria-hidden>
          <img
            src={infoIcon}
            alt=""
            aria-hidden
            className="site-icon-link__icon"
          />
        </span>
      </button>

      <SiteInfoReveal
        isOpen={isOpen}
        text={text}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

export default HeaderInfoButton;
