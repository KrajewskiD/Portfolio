import type { ProjectTopicContentField } from "@admin/components/projects/ProjectTopicContentPanel";
import type { ProjectTopicImageField } from "@admin/components/projects/ProjectTopicImagePanel";

export type ProjectTextField = "code" | "projectUrl" | "titlePl" | "titleEn";
export type TopicTextField = ProjectTopicContentField | ProjectTopicImageField;
