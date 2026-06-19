export type ProjectRow = {
  id: string;
  code: string | null;
  project_url: string | null;
  title_pl: string;
  title_en: string;
  display_order: number;
  video_path: string | null;
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
      icon_slug: string | null;
    } | null;
  }[];
};

export type TechnologyIdRow = {
  id: string;
};
