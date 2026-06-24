import ProjectMiniaturePanel from "@admin/components/projects/ProjectMiniaturePanel";
import ProjectTopicImagePanel from "@admin/components/projects/ProjectTopicImagePanel";
import type { ProjectMediaDraftState } from "@admin/forms/projects/useProjectMediaViewModel";
import type {
  ProjectMiniatureAltField,
  ProjectTopicImageField,
} from "@admin/forms/projects/projectEditorTypes";
import type { Language } from "@shared/database/types/language";
import type {
  Project,
  ProjectTopicContent,
} from "@shared/database/types/project";

type ProjectMediaColumnProps = {
  project: Project;
  topic: ProjectTopicContent;
  language: Language;
  disabled?: boolean;
  miniature: ProjectMediaDraftState;
  topicImage: ProjectMediaDraftState;
  onMiniatureAltChange: (
    field: ProjectMiniatureAltField,
    value: string,
  ) => void;
  onTopicChange: (field: ProjectTopicImageField, value: string) => void;
};

function ProjectMediaColumn({
  project,
  topic,
  language,
  disabled = false,
  miniature,
  topicImage,
  onMiniatureAltChange,
  onTopicChange,
}: ProjectMediaColumnProps) {
  return (
    <div className="admin-stack min-w-0">
      <ProjectMiniaturePanel
        project={project}
        language={language}
        selectedFile={miniature.selectedFile}
        imageMarkedForRemoval={miniature.markedForRemoval}
        disabled={disabled}
        onChange={onMiniatureAltChange}
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
