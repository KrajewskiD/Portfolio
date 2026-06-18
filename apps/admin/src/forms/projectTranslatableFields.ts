import type { TranslateFieldItem } from "@admin/hooks/useTranslateFields";
import type { Language } from "@shared/database/types/language";
import type {
  Project,
  ProjectTopicContent,
  ProjectTopicId,
} from "@shared/database/types/project";

import { createTranslateFields } from "@admin/forms/createTranslateFields";

type ProjectTitleKey = "titlePl" | "titleEn";
type TopicContentKey = "contentPl" | "contentEn";
type TopicImageAltKey = "imageAltPl" | "imageAltEn";

type ProjectTranslateCallbacks = {
  onApplyTitle: (field: ProjectTitleKey, text: string) => void;
  onApplyTopic: (
    topicId: ProjectTopicId,
    field: TopicContentKey | TopicImageAltKey,
    text: string,
  ) => void;
};

const projectTitleFieldConfig = [
  { id: "project-title", plKey: "titlePl" as const, enKey: "titleEn" as const },
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
  { onApplyTitle, onApplyTopic }: ProjectTranslateCallbacks,
): TranslateFieldItem[] {
  const titleFields = createTranslateFields(
    project,
    language,
    projectTitleFieldConfig,
    onApplyTitle,
  );

  const topicFields = project.topics.flatMap((topic) =>
    createTopicTranslateFields(topic, language, onApplyTopic),
  );

  return [...titleFields, ...topicFields];
}
