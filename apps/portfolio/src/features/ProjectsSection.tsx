import { useState } from "react";

import ProjectListItem from "@portfolio/components/projects/ProjectListItem";
import ProjectSkeleton from "@portfolio/components/projects/ProjectSkeleton";
import ProjectThumbnail from "@portfolio/components/projects/ProjectThumbnail";
import SectionHeading from "@portfolio/components/sections/SectionHeading";
import SectionStatePanel from "@portfolio/components/sections/SectionStatePanel";
import type { Translations } from "@portfolio/locales/translations";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

type ProjectsSectionProps = {
  projects?: Project[];
  isLoading: boolean;
  isError: boolean;
  text: Translations["projects"];
  language: Language;
};

function ProjectsSection({
  projects,
  isLoading,
  isError,
  text,
  language,
}: ProjectsSectionProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTopics, setActiveTopics] = useState<
    Record<string, ProjectTopicId>
  >({});

  const activeProject =
    projects?.find((project) => project.id === activeProjectId) ?? projects?.[0];

  return (
    <section id="projects" className="site-section--projects">
      <SectionHeading label={text.label} title={text.title} />

      <SectionStatePanel
        isLoading={isLoading}
        isError={isError}
        isEmpty={!projects?.length}
        errorMessage={text.loadError}
        emptyMessage={text.emptyMessage}
        emptyPanelClassName="site-panel--empty-lg"
        loading={<ProjectSkeleton />}
      >
        <div className="site-project-layout">
          <div className="site-project-grid">
            {projects?.map((project) => (
              <ProjectThumbnail
                key={project.id}
                project={project}
                language={language}
                isActive={project.id === activeProject?.id}
                onSelect={() => setActiveProjectId(project.id)}
              />
            ))}
          </div>

          {activeProject ? (
            <ProjectListItem
              key={activeProject.id}
              project={activeProject}
              language={language}
              noImage={text.noImage}
              openProjectLinkLabel={text.openProjectLink}
              selectedTopicId={
                activeTopics[activeProject.id] ?? DEFAULT_PROJECT_TOPIC_ID
              }
              onTopicChange={(topicId) =>
                setActiveTopics((current) => ({
                  ...current,
                  [activeProject.id]: topicId,
                }))
              }
            />
          ) : null}
        </div>
      </SectionStatePanel>
    </section>
  );
}

export default ProjectsSection;
