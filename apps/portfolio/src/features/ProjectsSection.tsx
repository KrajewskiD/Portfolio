import { useState } from "react";

import ProjectListItem from "@portfolio/components/projects/ProjectListItem";
import ProjectSkeleton from "@portfolio/components/projects/ProjectSkeleton";
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
  const [activeTopics, setActiveTopics] = useState<
    Record<string, ProjectTopicId>
  >({});

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
        projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            language={language}
            noImage={noImage}
            selectedTopicId={
              activeTopics[project.id] ?? DEFAULT_PROJECT_TOPIC_ID
            }
            onTopicChange={(topicId) =>
              setActiveTopics((current) => ({
                ...current,
                [project.id]: topicId,
              }))
            }
          />
        ))
      )}
    </section>
  );
}

export default ProjectsSection;
