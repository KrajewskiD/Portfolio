import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectImage from "../components/projects/ProjectImage";
import ProjectTopicsGroup from "../components/projects/ProjectTopicsGroup";
import TechnologyTag from "../components/projects/TechnologyTag";
import SectionHeading from "../components/sections/SectionHeading";
import type { Language } from "../types/language";
import type { Project, ProjectTopicId } from "../types/project";

type ProjectsSectionProps = {
  projects: Project[];
  label: string;
  title: string;
  topicLabels: Record<ProjectTopicId, string>;
  language: Language;
  noImage: string;
};

function ProjectsSection({
  projects,
  label,
  title,
  topicLabels,
  noImage,
  language,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="scroll-mt-0 pt-4 pb-8 sm:pt-6 sm:pb-10"
    >
      <SectionHeading label={label} title={title} />

      {projects.map((project) => {
        const projectTitle =
          language === "pl" ? project.titlePl : project.titleEn;

        const imageAlt =
          language === "pl" ? project.imageAltPl : project.imageAltEn;

        return (
          <ProjectCard key={project.id}>
            <ProjectImage
              imageUrl={project.imageUrl}
              alt={imageAlt}
              fallbackLabel={noImage}
            />

            <ProjectDetails
              code={project.code}
              title={projectTitle}
              technologies={project.technologies.map((technology) => (
                <TechnologyTag key={technology} label={technology} />
              ))}
              topics={
                <ProjectTopicsGroup
                  topics={project.topics}
                  topicLabels={topicLabels}
                  language={language}
                />
              }
            />
          </ProjectCard>
        );
      })}
    </section>
  );
}

export default ProjectsSection;
