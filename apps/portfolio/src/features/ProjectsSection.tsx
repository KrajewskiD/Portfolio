import { useEffect, useState } from "react";

import ProjectListItem from "@portfolio/components/projects/ProjectListItem";
import ProjectSkeleton from "@portfolio/components/projects/ProjectSkeleton";
import ProjectThumbnail from "@portfolio/components/projects/ProjectThumbnail";
import SectionHeading from "@portfolio/components/sections/SectionHeading";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

type ProjectsSectionProps = {
  projects?: Project[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  label: string;
  title: string;
  language: Language;
  noImage: string;
  emptyMessage: string;
};

function ProjectsSection({
  projects,
  isLoading,
  isError,
  errorMessage,
  label,
  title,
  noImage,
  emptyMessage,
  language,
}: ProjectsSectionProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTopics, setActiveTopics] = useState<
    Record<string, ProjectTopicId>
  >({});

  useEffect(() => {
    if (!projects?.length) {
      return;
    }

    setActiveProjectId((current) =>
      current && projects.some((project) => project.id === current)
        ? current
        : projects[0].id,
    );
  }, [projects]);

  const activeProject = projects?.find(
    (project) => project.id === activeProjectId,
  );

  return (
    <section id="projects" className="site-section--projects">
      <SectionHeading label={label} title={title} />

      {isLoading ? (
        <ProjectSkeleton />
      ) : isError ? (
        <div role="alert" className="site-panel--alert">
          <p className="site-text-error">{errorMessage}</p>
        </div>
      ) : !projects?.length ? (
        <div className="site-panel--empty-lg">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="site-project-layout">
            <div className="site-project-grid">
              {projects.map((project) => (
                <ProjectThumbnail
                  key={project.id}
                  project={project}
                  language={language}
                  isActive={project.id === activeProjectId}
                  onSelect={() => setActiveProjectId(project.id)}
                />
              ))}
            </div>

            {activeProject ? (
              <ProjectListItem
                key={activeProject.id}
                project={activeProject}
                language={language}
                noImage={noImage}
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
        </>
      )}
    </section>
  );
}

export default ProjectsSection;
