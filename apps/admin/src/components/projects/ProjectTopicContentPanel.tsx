import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { useTranslateField } from "@admin/hooks/useTranslateField";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";
import { getOppositeLocalizedKey } from "@shared/utils/localizedField";

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
  const contentField = language === "pl" ? "contentPl" : "contentEn";
  const topicLabel = projectTopicLabels[topic.id][language];
  const fieldId = `${topic.id}-content`;

  const contentTranslate = useTranslateField({
    language,
    sourceText: topic[contentField],
    disabled,
    onApply: (text) =>
      onChange(getOppositeLocalizedKey(language, "contentPl", "contentEn"), text),
  });

  return (
    <AdminTranslatableField
      id={fieldId}
      label={topicLabel}
      language={language}
      className={fillHeight ? "admin-field--fill" : undefined}
      onTranslate={() => void contentTranslate.onTranslate()}
      translateDisabled={disabled || contentTranslate.isTranslating}
      isTranslating={contentTranslate.isTranslating}
      translateError={contentTranslate.error}
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
