import type { ProjectTopicId } from "./projectTopic";

export type { ProjectTopicId };

export type ProjectTechnology = {
  name: string;
  iconSlug: string;
};

export function createEmptyProjectTechnology(): ProjectTechnology {
  return {
    name: "",
    iconSlug: "",
  };
}

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
  projectUrl?: string;
  titlePl: string;
  titleEn: string;
  technologies: ProjectTechnology[];
  miniaturePath?: string;
  miniatureUrl?: string;
  topics: ProjectTopics;
};
