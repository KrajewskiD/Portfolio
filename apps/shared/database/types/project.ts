import type { ProjectTopicId } from "./projectTopic";

export type { ProjectTopicId };

export type ProjectTopicContent = {
  id: ProjectTopicId;
  contentPl: string;
  contentEn: string;
  imagePath?: string;
  imageUrl?: string;
  imageAltPl: string;
  imageAltEn: string;
};

export type ProjectTopics = ProjectTopicContent[];

export type Project = {
  id: string;
  code?: string;
  titlePl: string;
  titleEn: string;
  technologies: string[];
  videoPath?: string;
  videoUrl?: string;
  topics: ProjectTopics;
};
