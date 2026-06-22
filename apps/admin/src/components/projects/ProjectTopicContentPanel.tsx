import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";

import { AdminLocalizedTextarea } from "@admin/components/ui/AdminLocalizedField";

export type ProjectTopicContentField = "contentPl" | "contentEn";

type ProjectTopicContentPanelProps = {
  topic: ProjectTopicContent;
  language: Language;
  fillHeight?: boolean;
  disabled?: boolean;
  onChange: (field: ProjectTopicContentField, value: string) => void;
};

function ProjectTopicContentPanel({
  topic,
  language,
  fillHeight = false,
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
      fillHeight={fillHeight}
      disabled={disabled}
      source={topic}
      plKey="contentPl"
      enKey="contentEn"
      onChange={onChange}
    />
  );
}

export default ProjectTopicContentPanel;
