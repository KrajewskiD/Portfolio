export type ProjectTextField =
  | "code"
  | "projectUrl"
  | "titlePl"
  | "titleEn"
  | "miniatureAltPl"
  | "miniatureAltEn";
export type ProjectTopicContentField = "contentPl" | "contentEn";
export type ProjectMiniatureAltField = "miniatureAltPl" | "miniatureAltEn";
export type ProjectTopicImageField = "imageAltPl" | "imageAltEn";
export type TopicTextField = ProjectTopicContentField | ProjectTopicImageField;
