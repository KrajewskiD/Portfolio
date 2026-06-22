import { useMemo } from "react";

import ProjectShowcaseSkeleton from "@portfolio/components/projects/ProjectShowcaseSkeleton";
import ProjectVideoCarousel from "@portfolio/components/projects/ProjectVideoCarousel";
import SectionStatePanel from "@portfolio/components/sections/SectionStatePanel";
import type { Translations } from "@portfolio/locales/translations";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

type ProjectShowcaseSectionProps = {
  projects?: Project[];
  isLoading: boolean;
  isError: boolean;
  text: Translations["showcase"];
  language: Language;
};

function ProjectShowcaseSection({
  projects,
  isLoading,
  isError,
  text,
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
      <SectionStatePanel
        isLoading={isLoading}
        isError={isError}
        errorMessage={text.loadError}
        loading={<ProjectShowcaseSkeleton />}
      >
        <ProjectVideoCarousel projects={showcaseProjects} language={language} />
      </SectionStatePanel>
    </section>
  );
}

export default ProjectShowcaseSection;
