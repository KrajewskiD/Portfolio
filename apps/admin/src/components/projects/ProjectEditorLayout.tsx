import ProjectBasicFields from "@admin/components/projects/ProjectBasicFields";
import ProjectContentColumn from "@admin/components/projects/ProjectContentColumn";
import ProjectMediaColumn from "@admin/components/projects/ProjectMediaColumn";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import type {
  ProjectTextField,
  TopicTextField,
} from "@admin/forms/projects/projectEditorTypes";
import type { Language } from "@shared/database/types/language";
import type {
  Project,
  ProjectTechnology,
  ProjectTopicContent,
  ProjectTopicId,
} from "@shared/database/types/project";

import type { ProjectMediaDraftState } from "@admin/forms/projects/useProjectMediaViewModel";

type ProjectEditorLayoutProps = {
  language: Language;
  project: Project;
  topic: ProjectTopicContent;
  projectTitle: string;
  disabled?: boolean;
  miniature: ProjectMediaDraftState;
  topicImage: ProjectMediaDraftState;
  onUpdateProject: (field: ProjectTextField, value: string) => void;
  onUpdateTopic: (field: TopicTextField, value: string) => void;
  onTopicTabChange: (topicId: ProjectTopicId) => void;
  onAddTechnology: () => void;
  onUpdateTechnology: (
    index: number,
    field: keyof Pick<ProjectTechnology, "name" | "iconSlug">,
    value: string,
  ) => void;
  onRemoveTechnology: (index: number) => void;
};

function ProjectEditorLayout({
  language,
  project,
  topic,
  projectTitle,
  disabled = false,
  miniature,
  topicImage,
  onUpdateProject,
  onUpdateTopic,
  onTopicTabChange,
  onAddTechnology,
  onUpdateTechnology,
  onRemoveTechnology,
}: ProjectEditorLayoutProps) {
  return (
    <>
      <AdminEditLanguageBanner language={language} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
        <div className="admin-stack min-w-0">
          <ProjectBasicFields
            project={project}
            disabled={disabled}
            onUpdate={onUpdateProject}
          />

          <ProjectMediaColumn
            project={project}
            topic={topic}
            projectTitle={projectTitle}
            language={language}
            disabled={disabled}
            miniature={miniature}
            topicImage={topicImage}
            onTopicChange={onUpdateTopic}
          />
        </div>

        <ProjectContentColumn
          project={project}
          topic={topic}
          language={language}
          disabled={disabled}
          onUpdateProject={onUpdateProject}
          onUpdateTopic={onUpdateTopic}
          onTopicChange={onTopicTabChange}
          onAddTechnology={onAddTechnology}
          onUpdateTechnology={onUpdateTechnology}
          onRemoveTechnology={onRemoveTechnology}
        />
      </div>
    </>
  );
}

export default ProjectEditorLayout;
