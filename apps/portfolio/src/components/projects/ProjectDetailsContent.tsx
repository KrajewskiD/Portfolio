import ProjectDetails from "@portfolio/components/projects/ProjectDetails";
import ProjectExternalLink from "@portfolio/components/projects/ProjectExternalLink";
import ProjectTechnologies from "@portfolio/components/projects/ProjectTechnologies";
import ProjectTopicsGroup from "@portfolio/components/projects/ProjectTopicsGroup";
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
  showTechnologies?: boolean;
  pinExternalLinkToTitle?: boolean;
};

function ProjectDetailsContent({
  project,
  language,
  openProjectLinkLabel,
  topicSectionLabel,
  selectedTopicId,
  onTopicChange,
  showTechnologies = true,
  pinExternalLinkToTitle = false,
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
      technologies={
        showTechnologies ? (
          <ProjectTechnologies technologies={project.technologies} />
        ) : null
      }
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
      pinExternalLinkToTitle={pinExternalLinkToTitle}
    />
  );
}

export default ProjectDetailsContent;
