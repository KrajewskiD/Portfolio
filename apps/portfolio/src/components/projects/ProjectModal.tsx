import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import crossIcon from "@shared/assets/icons/cross.svg";

import { useBodyScrollLock } from "@portfolio/hooks/useBodyScrollLock";

type ProjectModalProps = {
  isOpen: boolean;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};

function ProjectModal({
  isOpen,
  closeLabel,
  onClose,
  children,
}: ProjectModalProps) {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    document.body,
  );
}

export default ProjectModal;
