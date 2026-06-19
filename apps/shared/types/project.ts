import type { ProjectTechnology } from "../database/types/project";

export type { ProjectTechnology };

export type ProjectTopicId =
  | "overview"
  | "features"
  | "technologies"
  | "architecture";

export type ProjectTopicContent = {
  id: ProjectTopicId;
  contentPl: string;
  contentEn: string;
  imageUrl?: string;
  imageAltPl: string;
  imageAltEn: string;
};

export type ProjectTopics = ProjectTopicContent[];

export type Project = {
  id: string;
  code?: string;
  projectUrl?: string;
  titlePl: string;
  titleEn: string;
  technologies: ProjectTechnology[];
  topics: ProjectTopics;
};
