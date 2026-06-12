export type ProjectTopicData = {
  id: string;
  labelPl: string;
  labelEn: string;
  contentPl: string;
  contentEn: string;
};

export type Project = {
  id: string;
  code: string;
  titlePl: string;
  titleEn: string;
  imageUrl?: string;
  imageAltPl: string;
  imageAltEn: string;
  technologies: string[];
  topics: ProjectTopicData[];
};
