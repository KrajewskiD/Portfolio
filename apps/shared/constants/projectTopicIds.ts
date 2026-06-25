export const projectTopicIds = [
  "overview",
  "features",
  "technologies",
  "architecture",
] as const;

export type ProjectTopicId = (typeof projectTopicIds)[number];

export const DEFAULT_PROJECT_TOPIC_ID: ProjectTopicId = "overview";
