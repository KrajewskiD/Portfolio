import AdminField from "@admin/components/ui/AdminField";
import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslateButton from "@admin/components/ui/AdminTranslateButton";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/types/language";
import type { ProjectTopicContent } from "@shared/types/project";

export type ProjectTopicContentField = "contentPl" | "contentEn";

type ProjectTopicContentPanelProps = {
  topic: ProjectTopicContent;
  language: Language;
  onChange: (field: ProjectTopicContentField, value: string) => void;
};

function ProjectTopicContentPanel({
  topic,
  language,
  onChange,
}: ProjectTopicContentPanelProps) {
  const contentField = language === "pl" ? "contentPl" : "contentEn";
  const topicLabel = projectTopicLabels[topic.id][language];

  return (
    <AdminField
      id="project-topic-content"
      label={topicLabel}
      action={<AdminTranslateButton language={language} />}
    >
      <AdminTextarea
        id="project-topic-content"
        value={topic[contentField]}
        onChange={(event) => onChange(contentField, event.target.value)}
      />
    </AdminField>
  );
}

export default ProjectTopicContentPanel;