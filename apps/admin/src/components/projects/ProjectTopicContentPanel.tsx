import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";

export type ProjectTopicContentField = "contentPl" | "contentEn";

type ProjectTopicContentPanelProps = {
  topic: ProjectTopicContent;
  language: Language;
  fillHeight?: boolean;
  onChange: (field: ProjectTopicContentField, value: string) => void;
};

function ProjectTopicContentPanel({
  topic,
  language,
  fillHeight = false,
  onChange,
}: ProjectTopicContentPanelProps) {
  const contentField = language === "pl" ? "contentPl" : "contentEn";
  const topicLabel = projectTopicLabels[topic.id][language];
  const fieldId = `${topic.id}-content`;

  return (
    <AdminTranslatableField
      id={fieldId}
      label={topicLabel}
      language={language}
      className={fillHeight ? "admin-field--fill" : undefined}
    >
      <AdminTextarea
        id={fieldId}
        rows={fillHeight ? undefined : 5}
        value={topic[contentField]}
        onChange={(event) => onChange(contentField, event.target.value)}
      />
    </AdminTranslatableField>
  );
}

export default ProjectTopicContentPanel;
