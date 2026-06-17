export type ProjectRow = {
  id: string;
  code: string | null;
  title_pl: string;
  title_en: string;
  display_order: number;
  project_topics: {
    topic_type_id: string;
    content_pl: string;
    content_en: string;
    image_path: string | null;
    image_alt_pl: string | null;
    image_alt_en: string | null;
  }[];
  project_technologies: {
    display_order: number;
    technologies: {
      name: string;
    } | null;
  }[];
};

export type TechnologyIdRow = {
  id: string;
};
