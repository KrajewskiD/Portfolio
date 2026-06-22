import ProjectMiniaturePanel from "@admin/components/projects/ProjectMiniaturePanel";
import ProjectTopicImagePanel from "@admin/components/projects/ProjectTopicImagePanel";
import type { ProjectMediaDraftState } from "@admin/forms/projects/useProjectMediaViewModel";
import type { ProjectTopicImageField } from "@admin/forms/projects/projectEditorTypes";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicContent } from "@shared/database/types/project";

type ProjectMediaColumnProps = {
  project: Project;
  topic: ProjectTopicContent;
  projectTitle: string;
  language: Language;
  disabled?: boolean;
  miniature: ProjectMediaDraftState;
  topicImage: ProjectMediaDraftState;
  onTopicChange: (field: ProjectTopicImageField, value: string) => void;
};

function ProjectMediaColumn({
  project,
  topic,
  projectTitle,
  language,
  disabled = false,
  miniature,
  topicImage,
  onTopicChange,
}: ProjectMediaColumnProps) {
  return (
    <div className="admin-stack min-w-0">
      <ProjectMiniaturePanel
        miniatureUrl={project.miniatureUrl}
        projectTitle={projectTitle}
        selectedFile={miniature.selectedFile}
        imageMarkedForRemoval={miniature.markedForRemoval}
        disabled={disabled}
        onFileSelect={miniature.handlers.onFileSelect}
        onImageMarkedForRemovalChange={
          miniature.handlers.onMarkedForRemovalChange
        }
      />

      <ProjectTopicImagePanel
        topic={topic}
        language={language}
        disabled={disabled}
        selectedFile={topicImage.selectedFile}
        imageMarkedForRemoval={topicImage.markedForRemoval}
        onFileSelect={topicImage.handlers.onFileSelect}
        onImageMarkedForRemovalChange={
          topicImage.handlers.onMarkedForRemovalChange
        }
        onChange={onTopicChange}
      />
    </div>
  );
}

export default ProjectMediaColumn;
