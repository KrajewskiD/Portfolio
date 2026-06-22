import ProjectCard from "@portfolio/components/projects/ProjectCard";
import ProjectDetails from "@portfolio/components/projects/ProjectDetails";
import ProjectExternalLink from "@portfolio/components/projects/ProjectExternalLink";
import ProjectImage from "@portfolio/components/projects/ProjectImage";
import ProjectTopicsGroup from "@portfolio/components/projects/ProjectTopicsGroup";
import TechnologyTag from "@portfolio/components/projects/TechnologyTag";
import { useProjectTopic } from "@portfolio/hooks/useProjectTopic";
import { getLocalizedField } from "@shared/utils/localizedField";
import { normalizeExternalUrl } from "@shared/utils/externalUrl";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

type ProjectListItemProps = {
  project: Project;
  language: Language;
  noImage: string;
  openProjectLinkLabel: string;
  topicSectionLabel: string;
  selectedTopicId: ProjectTopicId;
  onTopicChange: (topicId: ProjectTopicId) => void;
};

function ProjectListItem({
  project,
  language,
  noImage,
  openProjectLinkLabel,
  topicSectionLabel,
  selectedTopicId,
  onTopicChange,
}: ProjectListItemProps) {
  const { activeTopic, activeTopicId } = useProjectTopic({
    topics: project.topics,
    selectedTopicId,
  });

  if (!activeTopic) {
    return null;
  }

  const projectTitle = getLocalizedField(
    project,
    language,
    "titlePl",
    "titleEn",
  );
  const imageAlt = getLocalizedField(
    activeTopic,
    language,
    "imageAltPl",
    "imageAltEn",
  );

  return (
    <ProjectCard>
      <ProjectImage
        imageUrl={activeTopic.imageUrl}
        alt={imageAlt}
        fallbackLabel={noImage}
      />

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
    </ProjectCard>
  );
}

export default ProjectListItem;
