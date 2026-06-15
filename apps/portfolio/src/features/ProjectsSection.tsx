import { useState } from "react";

import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectImage from "../components/projects/ProjectImage";
import ProjectSkeleton from "../components/projects/ProjectSkeleton";
import ProjectTopicsGroup from "../components/projects/ProjectTopicsGroup";
import TechnologyTag from "../components/projects/TechnologyTag";
import SectionHeading from "../components/sections/SectionHeading";
import type { Language } from "@shared/types/language";
import type { Project, ProjectTopicId } from "@shared/types/project";

type ProjectsSectionProps = {
  projects?: Project[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  label: string;
  title: string;
  topicLabels: Record<ProjectTopicId, string>;
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
  topicLabels,
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
        projects.map((project) => {
          const projectTitle =
            language === "pl" ? project.titlePl : project.titleEn;

          const selectedTopicId = activeTopics[project.id] ?? "overview";

          const activeTopic =
            project.topics.find((topic) => topic.id === selectedTopicId) ??
            project.topics[0];

          if (!activeTopic) {
            return null;
          }

          const imageAlt =
            language === "pl" ? activeTopic.imageAltPl : activeTopic.imageAltEn;

          return (
            <ProjectCard key={project.id}>
              <ProjectImage
                imageUrl={activeTopic.imageUrl}
                alt={imageAlt}
                fallbackLabel={noImage}
              />

              <ProjectDetails
                code={project.code ?? ""}
                title={projectTitle}
                technologies={project.technologies.map((technology) => (
                  <TechnologyTag key={technology} label={technology} />
                ))}
                topics={
                  <ProjectTopicsGroup
                    topics={project.topics}
                    activeId={activeTopic.id}
                    onTopicChange={(topicId) =>
                      setActiveTopics((current) => ({
                        ...current,
                        [project.id]: topicId,
                      }))
                    }
                    topicLabels={topicLabels}
                    language={language}
                  />
                }
              />
            </ProjectCard>
          );
        })
      )}
    </section>
  );
}

export default ProjectsSection;
