import { getLocalizedField } from "@shared/utils/localizedField";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

import { useProjectTopic } from "@portfolio/hooks/useProjectTopic";

type ProjectThumbnailProps = {
  project: Project;
  language: Language;
  isActive: boolean;
  onSelect: () => void;
};

function ProjectThumbnail({
  project,
  language,
  isActive,
  onSelect,
}: ProjectThumbnailProps) {
  const { activeTopic } = useProjectTopic({ topics: project.topics });
  const title = getLocalizedField(project, language, "titlePl", "titleEn");
  const imageAlt = activeTopic
    ? getLocalizedField(activeTopic, language, "imageAltPl", "imageAltEn")
    : title;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={title}
      className={`site-project-thumb${isActive ? " site-project-thumb--active" : ""}`}
      onClick={onSelect}
    >
      {activeTopic?.imageUrl ? (
        <img
          src={activeTopic.imageUrl}
          alt={imageAlt}
          className="site-project-thumb__image"
        />
      ) : (
        <div aria-hidden className="site-project-thumb__placeholder" />
      )}

      <span aria-hidden className="site-project-thumb__overlay">
        <span className="site-project-thumb__name">{title}</span>
      </span>
    </button>
  );
}

export default ProjectThumbnail;
