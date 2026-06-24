import { useState } from "react";

import infoIcon from "@shared/assets/icons/info.svg";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

import ProjectInfoCard from "@portfolio/components/projects/ProjectInfoCard";
import ProjectModal from "@portfolio/components/projects/ProjectModal";
import type { Translations } from "@portfolio/locales/translations";

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
  const [activeTopicId, setActiveTopicId] = useState<ProjectTopicId>(
    DEFAULT_PROJECT_TOPIC_ID,
  );

  return (
    <>
      <div className="site-chrome-info site-social-icon-scale">
        <button
          type="button"
          className="site-chrome-info__trigger"
          aria-label={title}
          aria-expanded={isOpen}
          title={title}
          onClick={() => setIsOpen(true)}
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
