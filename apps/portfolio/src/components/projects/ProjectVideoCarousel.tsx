import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

import ProjectShowcaseTile from "./ProjectShowcaseTile";

type ProjectVideoCarouselProps = {
  projects: Project[];
  language: Language;
};

function ProjectVideoCarousel({ projects, language }: ProjectVideoCarouselProps) {
  const loopedProjects = [...projects, ...projects];

  return (
    <div className="site-showcase-strip" aria-hidden>
      <div className="site-showcase-strip__viewport">
        <div className="site-showcase-strip__track">
          {loopedProjects.map((project, index) => (
            <ProjectShowcaseTile
              key={`${project.id}-${index}`}
              project={project}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectVideoCarousel;
