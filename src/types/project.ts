export type ProjectTopicId =
  | "overview"
  | "features"
  | "technologies"
  | "architecture";

export type ProjectTopicContent = {
  id: ProjectTopicId;
  contentPl: string;
  contentEn: string;
};

export type ProjectTopics = ProjectTopicContent[];

export type Project = {
  id: string;
  code: string;
  titlePl: string;
  titleEn: string;
  imageUrl?: string;
  imageAltPl: string;
  imageAltEn: string;
  technologies: string[];
  topics: ProjectTopics;
};
