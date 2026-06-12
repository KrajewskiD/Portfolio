import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectImage from "../components/projects/ProjectImage";
import ProjectTopicsGroup from "../components/projects/ProjectTopicsGroup";
import TechnologyTag from "../components/projects/TechnologyTag";
import SectionHeading from "../components/sections/SectionHeading";
import type { Project } from "../types/project";

type ProjectsSectionProps = {
  projects: Project[];
  label: string;
  title: string;
};

function ProjectsSection({
    projects,
    label,
    title
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="scroll-mt-24 pt-16 pb-8 sm:pt-20 sm:pb-10"
    >
      <SectionHeading
        label={label}
        title={title}
      />

      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectImage
            imageUrl={project.imageUrl}
            alt={project.imageAlt}
          />

          <ProjectDetails
            code={project.code}
            title={project.title}
            technologies={project.technologies.map((technology) => (
              <TechnologyTag
                key={technology}
                label={technology}
              />
            ))}
            topics={
              <ProjectTopicsGroup
                topics={project.topics}
              />
            }
          />
        </ProjectCard>
      ))}
    </section>
  );
}

export default ProjectsSection;