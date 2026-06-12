export type ProjectTopicData = {
  id: string;
  label: string;
  content: string;
};

export type Project = {
  code: string;
  title: string;
  imageUrl?: string;
  imageAlt: string;
  technologies: string[];
  topics: ProjectTopicData[];
};