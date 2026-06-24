import type { TranslateFieldItem } from "@admin/hooks/useTranslateFields";
import type { Language } from "@shared/database/types/language";
import type {
  Project,
  ProjectTopicContent,
  ProjectTopicId,
} from "@shared/database/types/project";

import { createTranslateFields } from "@admin/forms/createTranslateFields";
import type {
  ProjectTextField,
  ProjectTopicContentField,
  ProjectTopicImageField,
} from "@admin/forms/projects/projectEditorTypes";

type ProjectTitleKey = Extract<ProjectTextField, "titlePl" | "titleEn">;
type ProjectMiniatureAltKey = Extract<
  ProjectTextField,
  "miniatureAltPl" | "miniatureAltEn"
>;
type TopicContentKey = ProjectTopicContentField;
type TopicImageAltKey = ProjectTopicImageField;

type ProjectTranslateCallbacks = {
  onApplyTitle: (field: ProjectTitleKey, text: string) => void;
  onApplyMiniatureAlt: (field: ProjectMiniatureAltKey, text: string) => void;
  onApplyTopic: (
    topicId: ProjectTopicId,
    field: TopicContentKey | TopicImageAltKey,
    text: string,
  ) => void;
};

const projectTitleFieldConfig = [
  { id: "project-title", plKey: "titlePl" as const, enKey: "titleEn" as const },
];

const projectMiniatureAltFieldConfig = [
  {
    id: "project-miniature-alt",
    plKey: "miniatureAltPl" as const,
    enKey: "miniatureAltEn" as const,
  },
];

function createTopicTranslateFields(
  topic: ProjectTopicContent,
  language: Language,
  onApplyTopic: ProjectTranslateCallbacks["onApplyTopic"],
): TranslateFieldItem[] {
  const contentFields = createTranslateFields(
    topic,
    language,
    [
      {
        id: `topic-${topic.id}-content`,
        plKey: "contentPl",
        enKey: "contentEn",
      },
    ],
    (field, text) => onApplyTopic(topic.id, field, text),
  );

  const imageAltFields = createTranslateFields(
    topic,
    language,
    [
      {
        id: `topic-${topic.id}-image-alt`,
        plKey: "imageAltPl",
        enKey: "imageAltEn",
      },
    ],
    (field, text) => onApplyTopic(topic.id, field, text),
  );

  return [...contentFields, ...imageAltFields];
}

export function createProjectTranslateFields(
  project: Project,
  language: Language,
  {
    onApplyTitle,
    onApplyMiniatureAlt,
    onApplyTopic,
  }: ProjectTranslateCallbacks,
): TranslateFieldItem[] {
  const titleFields = createTranslateFields(
    project,
    language,
    projectTitleFieldConfig,
    onApplyTitle,
  );

  const miniatureAltFields = createTranslateFields(
    project,
    language,
    projectMiniatureAltFieldConfig,
    onApplyMiniatureAlt,
  );

  const topicFields = project.topics.flatMap((topic) =>
    createTopicTranslateFields(topic, language, onApplyTopic),
  );

  return [...titleFields, ...miniatureAltFields, ...topicFields];
}
