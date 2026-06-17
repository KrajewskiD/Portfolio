import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";
import {
  getLocalizedField,
  getLocalizedKey,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

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
  const contentField = getLocalizedKey(language, "contentPl", "contentEn");
  const topicLabel = projectTopicLabels[topic.id][language];
  const fieldId = `${topic.id}-content`;

  return (
    <AdminTranslatableField
      id={fieldId}
      label={topicLabel}
      language={language}
      className={fillHeight ? "admin-field--fill" : undefined}
      disabled={disabled}
      sourceText={getLocalizedField(topic, language, "contentPl", "contentEn")}
      onApply={(text) =>
        onChange(
          getOppositeLocalizedKey(language, "contentPl", "contentEn"),
          text,
        )
      }
    >
      <AdminTextarea
        id={fieldId}
        rows={fillHeight ? undefined : 5}
        value={topic[contentField]}
        disabled={disabled}
        onChange={(event) => onChange(contentField, event.target.value)}
      />
    </AdminTranslatableField>
  );
}

export default ProjectTopicContentPanel;
