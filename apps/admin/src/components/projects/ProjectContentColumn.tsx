import ProjectTechnologiesField from "@admin/components/projects/ProjectTechnologiesField";
import ProjectTopicContentPanel from "@admin/components/projects/ProjectTopicContentPanel";
import ProjectTopicTabs from "@admin/components/projects/ProjectTopicTabs";
import AdminField from "@admin/components/ui/AdminField";
import { AdminLocalizedInput } from "@admin/components/ui/AdminLocalizedField";
import type {
  ProjectTextField,
  TopicTextField,
} from "@admin/forms/projects/useProjectsEditor";
import { PROJECT_TITLE_MAX_LENGTH } from "@shared/constants/project";
import type { Language } from "@shared/database/types/language";
import type {
  Project,
  ProjectTechnology,
  ProjectTopicContent,
  ProjectTopicId,
} from "@shared/database/types/project";

type ProjectContentColumnProps = {
  project: Project;
  topic: ProjectTopicContent;
  language: Language;
  disabled?: boolean;
  onUpdateProject: (field: ProjectTextField, value: string) => void;
  onUpdateTopic: (field: TopicTextField, value: string) => void;
  onTopicChange: (topicId: ProjectTopicId) => void;
  onAddTechnology: () => void;
  onUpdateTechnology: (
    index: number,
    field: keyof Pick<ProjectTechnology, "name" | "iconSlug">,
    value: string,
  ) => void;
  onRemoveTechnology: (index: number) => void;
};

function ProjectContentColumn({
  project,
  topic,
  language,
  disabled = false,
  onUpdateProject,
  onUpdateTopic,
  onTopicChange,
  onAddTechnology,
  onUpdateTechnology,
  onRemoveTechnology,
}: ProjectContentColumnProps) {
  return (
    <div className="flex min-h-full flex-col gap-6">
      <div className="admin-stack">
        <AdminLocalizedInput
          id="project-title"
          label="Nazwa projektu"
          hint={`Maksymalnie ${PROJECT_TITLE_MAX_LENGTH} znaków.`}
          language={language}
          disabled={disabled}
          source={project}
          plKey="titlePl"
          enKey="titleEn"
          maxLength={PROJECT_TITLE_MAX_LENGTH}
          onChange={onUpdateProject}
        />

        <ProjectTechnologiesField
          id="project-technologies"
          technologies={project.technologies}
          disabled={disabled}
          onAdd={onAddTechnology}
          onUpdate={onUpdateTechnology}
          onRemove={onRemoveTechnology}
        />

        <AdminField id="project-topic-tabs" label="Zakładka projektu" groupLabel>
          <ProjectTopicTabs
            activeTopicId={topic.id}
            language={language}
            labelledBy="project-topic-tabs-label"
            onChange={onTopicChange}
          />
        </AdminField>
      </div>

      <ProjectTopicContentPanel
        topic={topic}
        language={language}
        fillHeight
        disabled={disabled}
        onChange={onUpdateTopic}
      />
    </div>
  );
}

export default ProjectContentColumn;
