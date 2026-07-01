import { useEffect, useRef, useState } from "react";

import infoIcon from "@shared/assets/icons/info.svg";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

import ProjectInfoCard from "@portfolio/components/projects/ProjectInfoCard";
import ProjectModal from "@portfolio/components/projects/ProjectModal";
import type { Translations } from "@portfolio/locales/translations";

const FAR_PULSE_SPEED_MS = 5000;
const NEAR_PULSE_SPEED_MS = 1200;
const PULSE_PROXIMITY_RADIUS_PX = 400;
const PULSE_SPEED_LERP_AMOUNT = 0.06;

type HeaderInfoButtonProps = {
  title: string;
  closeLabel: string;
  emptyMessage: string;
  project?: Project;
  projectText: Translations["projects"];
  language: Language;
};

function HeaderInfoButton({
  title,
  closeLabel,
  emptyMessage,
  project,
  projectText,
  language,
}: HeaderInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [activeTopicId, setActiveTopicId] = useState<ProjectTopicId>(
    DEFAULT_PROJECT_TOPIC_ID,
  );

  useEffect(() => {
    const button = buttonRef.current;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (!button || reducedMotionQuery.matches) {
      return;
    }

    let animationFrameId = 0;
    let hasPointerPosition = false;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pulseAnimations: Animation[] = [];
    let currentPlaybackRate = 1;

    const refreshPulseAnimations = () => {
      pulseAnimations = button.getAnimations({ subtree: true });
    };

    const updateAnimationPlaybackRate = (playbackRate: number) => {
      pulseAnimations.forEach((animation) => {
        if (typeof animation.updatePlaybackRate === "function") {
          animation.updatePlaybackRate(playbackRate);
          return;
        }

        animation.playbackRate = playbackRate;
      });
    };

    const updatePulseSpeed = () => {
      let targetPulseSpeed = FAR_PULSE_SPEED_MS;

      if (hasPointerPosition) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        const pointerX = pointerClientX + window.scrollX;
        const pointerY = pointerClientY + window.scrollY;
        const distance = Math.hypot(pointerX - centerX, pointerY - centerY);
        const proximity = Math.max(0, 1 - distance / PULSE_PROXIMITY_RADIUS_PX);
        targetPulseSpeed =
          FAR_PULSE_SPEED_MS -
          (FAR_PULSE_SPEED_MS - NEAR_PULSE_SPEED_MS) * proximity;
      }

      const targetPlaybackRate = FAR_PULSE_SPEED_MS / targetPulseSpeed;
      currentPlaybackRate +=
        (targetPlaybackRate - currentPlaybackRate) * PULSE_SPEED_LERP_AMOUNT;

      if (pulseAnimations.length === 0) {
        refreshPulseAnimations();
      }

      updateAnimationPlaybackRate(currentPlaybackRate);
      animationFrameId = window.requestAnimationFrame(updatePulseSpeed);
    };

    const updatePointerPosition = (event: PointerEvent) => {
      hasPointerPosition = true;
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
    };

    const resetPointerPosition = () => {
      hasPointerPosition = false;
    };

    refreshPulseAnimations();
    animationFrameId = window.requestAnimationFrame(updatePulseSpeed);

    window.addEventListener("pointermove", updatePointerPosition, {
      passive: true,
    });
    window.addEventListener("pointerleave", resetPointerPosition);
    window.addEventListener("blur", resetPointerPosition);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", updatePointerPosition);
      window.removeEventListener("pointerleave", resetPointerPosition);
      window.removeEventListener("blur", resetPointerPosition);
      updateAnimationPlaybackRate(1);
    };
  }, []);

  return (
    <>
      <div className="site-chrome-info site-social-icon-scale">
        <button
          ref={buttonRef}
          type="button"
          className="site-chrome-info__trigger site-icon-link"
          aria-label={title}
          aria-expanded={isOpen}
          title={title}
          onClick={() => setIsOpen(true)}
        >
          <span className="site-chrome-info__halo" aria-hidden />
          <img
            src={infoIcon}
            alt=""
            aria-hidden
            className="site-icon-link__icon"
          />
        </button>
      </div>

      <ProjectModal
        isOpen={isOpen}
        closeLabel={closeLabel}
        onClose={() => setIsOpen(false)}
      >
        {project ? (
          <ProjectInfoCard
            project={project}
            language={language}
            openProjectLinkLabel={projectText.openProjectLink}
            topicSectionLabel={projectText.topicSectionLabel}
            selectedTopicId={activeTopicId}
            onTopicChange={setActiveTopicId}
          />
        ) : (
          <div className="site-panel--empty-lg site-project-modal__empty">
            <p className="site-text-muted">{emptyMessage}</p>
          </div>
        )}
      </ProjectModal>
    </>
  );
}

export default HeaderInfoButton;
