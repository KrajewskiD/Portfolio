import ProjectCard from "@portfolio/components/projects/ProjectCard";
import ProjectDetailsContent from "@portfolio/components/projects/ProjectDetailsContent";
import ProjectImage from "@portfolio/components/projects/ProjectImage";
import { useProjectTopic } from "@portfolio/hooks/useProjectTopic";
import { getLocalizedField } from "@shared/utils/localizedField";
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

      <ProjectDetailsContent
        project={project}
        language={language}
        openProjectLinkLabel={openProjectLinkLabel}
        topicSectionLabel={topicSectionLabel}
        selectedTopicId={activeTopicId}
        onTopicChange={onTopicChange}
      />
    </ProjectCard>
  );
}

export default ProjectListItem;
