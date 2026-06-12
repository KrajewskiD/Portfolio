import type { Project } from "../types/project";
import SectionHeading from "../components/sections/SectionHeading";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectImage from "../components/projects/ProjectImage";
import ProjectDetails from "../components/projects/ProjectDetails";
import TechnologyTag from "../components/projects/TechnologyTag";
import ProjectTopic from "../components/projects/ProjectTopic";

type ProjectsSectionProps = {
  projects: Project[];
};

function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="scroll-mt-24 pt-16 pb-8 sm:pt-20 sm:pb-10"
    >
      <SectionHeading label="projekty" title="Wybrane projekty" />

      {projects.map((project) => (
        <ProjectCard key={project.code}>
          <ProjectImage
            imageUrl={project.imageUrl}
            alt={project.imageAlt}
          />

          <ProjectDetails
            code={project.code}
            title={project.title}
            descriptionLabel={project.descriptionLabel}
            technologies={project.technologies.map((technology) => (
                <TechnologyTag
                key={technology}
                label={technology}
                />
            ))}
            topics={project.topics.map((topic, index) => (
                <ProjectTopic
                    key={topic.id}
                    label={topic.label}
                    active={index === 0}
                />
            ))}
          >
            <p>{project.description}</p>
          </ProjectDetails>
        </ProjectCard>
      ))}
    </section>
  );
}

export default ProjectsSection;