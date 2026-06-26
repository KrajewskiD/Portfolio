import { type ReactNode } from "react";
import { createPortal } from "react-dom";

import crossIcon from "@shared/assets/icons/cross.svg";

import { useBodyScrollLock } from "@portfolio/hooks/useBodyScrollLock";

type ProjectModalProps = {
  isOpen: boolean;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};

function getPortalRoot(): HTMLElement {
  return document.getElementById("site-portal-root") ?? document.body;
}

function ProjectModal({
  isOpen,
  closeLabel,
  onClose,
  children,
}: ProjectModalProps) {
  useBodyScrollLock(isOpen);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="site-project-modal" role="presentation">
      <button
        type="button"
        className="site-project-modal__backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />

      <div
        className="site-project-modal__dialog"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="site-project-modal__close site-icon-link site-social-icon-scale"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <img
            src={crossIcon}
            alt=""
            aria-hidden
            className="site-icon-link__icon"
          />
        </button>

        {children}
      </div>
    </div>,
    getPortalRoot(),
  );
}

export default ProjectModal;
