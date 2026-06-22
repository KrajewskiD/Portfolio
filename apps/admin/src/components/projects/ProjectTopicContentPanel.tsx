import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";

import { AdminLocalizedTextarea } from "@admin/components/ui/AdminLocalizedField";
import type { ProjectTopicContentField } from "@admin/forms/projects/projectEditorTypes";

type ProjectTopicContentPanelProps = {
  topic: ProjectTopicContent;
  language: Language;
  disabled?: boolean;
  onChange: (field: ProjectTopicContentField, value: string) => void;
};

function ProjectTopicContentPanel({
  topic,
  language,
  disabled = false,
  onChange,
}: ProjectTopicContentPanelProps) {
  const topicLabel = projectTopicLabels[topic.id][language];
  const fieldId = `${topic.id}-content`;

  return (
    <AdminLocalizedTextarea
      id={fieldId}
      label={topicLabel}
      language={language}
      rows={4}
      disabled={disabled}
      source={topic}
      plKey="contentPl"
      enKey="contentEn"
      onChange={onChange}
    />
  );
}

export default ProjectTopicContentPanel;
