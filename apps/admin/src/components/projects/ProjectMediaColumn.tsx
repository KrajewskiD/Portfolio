import ProjectMiniaturePanel from "@admin/components/projects/ProjectMiniaturePanel";
import ProjectTopicImagePanel, {
  type ProjectTopicImageField,
} from "@admin/components/projects/ProjectTopicImagePanel";
import ProjectVideoPanel from "@admin/components/projects/ProjectVideoPanel";
import type { Language } from "@shared/database/types/language";
import type { Project, ProjectTopicContent } from "@shared/database/types/project";

type MediaFileHandlers = {
  onFileSelect: (file: File | null) => void;
  onMarkedForRemovalChange: (marked: boolean) => void;
};

type ProjectMediaColumnProps = {
  project: Project;
  topic: ProjectTopicContent;
  projectTitle: string;
  language: Language;
  disabled?: boolean;
  miniature: {
    selectedFile: File | null;
    markedForRemoval: boolean;
    handlers: MediaFileHandlers;
  };
  topicImage: {
    selectedFile: File | null;
    markedForRemoval: boolean;
    handlers: MediaFileHandlers;
  };
  video: {
    selectedFile: File | null;
    markedForRemoval: boolean;
    handlers: MediaFileHandlers;
  };
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
  video,
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

      <ProjectVideoPanel
        videoUrl={project.videoUrl}
        selectedFile={video.selectedFile}
        videoMarkedForRemoval={video.markedForRemoval}
        disabled={disabled}
        onFileSelect={video.handlers.onFileSelect}
        onVideoMarkedForRemovalChange={video.handlers.onMarkedForRemovalChange}
      />
    </div>
  );
}

export default ProjectMediaColumn;
