import ProjectCard from "@portfolio/components/projects/ProjectCard";
import ProjectDetailsContent from "@portfolio/components/projects/ProjectDetailsContent";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

type ProjectInfoCardProps = {
  project: Project;
  language: Language;
  openProjectLinkLabel: string;
  topicSectionLabel: string;
  selectedTopicId: ProjectTopicId;
  onTopicChange: (topicId: ProjectTopicId) => void;
};

function ProjectInfoCard({
  project,
  language,
  openProjectLinkLabel,
  topicSectionLabel,
  selectedTopicId,
  onTopicChange,
}: ProjectInfoCardProps) {
  return (
    <ProjectCard className="site-card--project-info">
      <ProjectDetailsContent
        project={project}
        language={language}
        openProjectLinkLabel={openProjectLinkLabel}
        topicSectionLabel={topicSectionLabel}
        selectedTopicId={selectedTopicId}
        onTopicChange={onTopicChange}
      />
    </ProjectCard>
  );
}

export default ProjectInfoCard;
