import { getLocalizedField } from "@shared/utils/localizedField";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

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
  const title = getLocalizedField(project, language, "titlePl", "titleEn");

  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={title}
      className={`site-project-thumb shrink-0${isActive ? " site-project-thumb--active" : ""}`}
      style={{
        width: "14rem",
        height: "14rem",
        flex: "0 0 14rem",
      }}
      onClick={onSelect}
    >
      {project.miniatureUrl ? (
        <img
          src={project.miniatureUrl}
          alt={title}
          className="site-project-thumb__image"
        />
      ) : (
        <div aria-hidden className="site-project-thumb__placeholder" />
      )}

      <span aria-hidden className="site-project-thumb__overlay">
        <span className="site-project-thumb__name-panel">
          <span className="site-project-thumb__name">{title}</span>
        </span>
      </span>
    </button>
  );
}

export default ProjectThumbnail;
