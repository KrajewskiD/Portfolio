import TechnologyTag from "@portfolio/components/projects/TechnologyTag";
import type { Project } from "@shared/database/types/project";

type ProjectTechnologiesProps = {
  technologies: Project["technologies"];
};

function ProjectTechnologies({ technologies }: ProjectTechnologiesProps) {
  if (!technologies.length) {
    return null;
  }

  return (
    <div className="site-project-technologies">
      <div className="site-project-technologies__card">
        {technologies.map((technology) => (
          <TechnologyTag
            key={technology.name}
            label={technology.name}
            iconSlug={technology.iconSlug}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectTechnologies;
