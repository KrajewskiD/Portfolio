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
    <section id="projects" className="scroll-mt-0 pt-4 pb-8 sm:pt-6 sm:pb-10">
      <SectionHeading label={label} title={title} />

      {isLoading ? (
        <ProjectSkeleton />
      ) : isError ? (
        <div
          role="alert"
          className="mt-8 flex min-h-96 items-center justify-center rounded-3xl border text-center"
        >
          <p className="text-lg">{errorMessage}</p>
        </div>
      ) : !projects?.length ? (
        <div className="mt-8 flex min-h-64 items-center justify-center rounded-3xl border text-center">
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
