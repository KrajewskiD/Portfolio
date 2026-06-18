import { useMemo } from "react";

import ProjectShowcaseSkeleton from "@portfolio/components/projects/ProjectShowcaseSkeleton";
import ProjectVideoCarousel from "@portfolio/components/projects/ProjectVideoCarousel";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

type ProjectShowcaseSectionProps = {
  projects?: Project[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  language: Language;
};

function ProjectShowcaseSection({
  projects,
  isLoading,
  isError,
  errorMessage,
  language,
}: ProjectShowcaseSectionProps) {
  const showcaseProjects = useMemo(
    () => projects?.filter((project) => project.videoUrl) ?? [],
    [projects],
  );

  if (!isLoading && !isError && showcaseProjects.length === 0) {
    return null;
  }

  return (
    <section id="showcase" className="site-section--showcase">
      {isLoading ? (
        <ProjectShowcaseSkeleton />
      ) : isError ? (
        <div role="alert" className="site-panel--alert">
          <p className="site-text-error">{errorMessage}</p>
        </div>
      ) : (
        <ProjectVideoCarousel projects={showcaseProjects} language={language} />
      )}
    </section>
  );
}

export default ProjectShowcaseSection;
