import ProjectDetails from "@portfolio/components/projects/ProjectDetails";
import ProjectExternalLink from "@portfolio/components/projects/ProjectExternalLink";
import ProjectTopicsGroup from "@portfolio/components/projects/ProjectTopicsGroup";
import TechnologyTag from "@portfolio/components/projects/TechnologyTag";
import { useProjectTopic } from "@portfolio/hooks/useProjectTopic";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";
import { normalizeExternalUrl } from "@shared/utils/externalUrl";
import { getLocalizedField } from "@shared/utils/localizedField";

type ProjectDetailsContentProps = {
  project: Project;
  language: Language;
  openProjectLinkLabel: string;
  topicSectionLabel: string;
  selectedTopicId: ProjectTopicId;
  onTopicChange: (topicId: ProjectTopicId) => void;
};

function ProjectDetailsContent({
  project,
  language,
  openProjectLinkLabel,
  topicSectionLabel,
  selectedTopicId,
  onTopicChange,
}: ProjectDetailsContentProps) {
  const { activeTopicId } = useProjectTopic({
    topics: project.topics,
    selectedTopicId,
  });
  const projectTitle = getLocalizedField(
    project,
    language,
    "titlePl",
    "titleEn",
  );

  return (
    <ProjectDetails
      code={project.code ?? ""}
      title={projectTitle}
      technologies={project.technologies.map((technology) => (
        <TechnologyTag
          key={technology.name}
          label={technology.name}
          iconSlug={technology.iconSlug}
        />
      ))}
      topics={
        <ProjectTopicsGroup
          topics={project.topics}
          activeId={activeTopicId}
          onTopicChange={onTopicChange}
          language={language}
          sectionLabel={topicSectionLabel}
        />
      }
      externalLink={
        project.projectUrl ? (
          <ProjectExternalLink
            href={normalizeExternalUrl(project.projectUrl)}
            label={openProjectLinkLabel}
          />
        ) : null
      }
    />
  );
}

export default ProjectDetailsContent;
