export type SkillGroupRow = {
  id: string;
  title_pl: string;
  title_en: string;
  display_order: number;
  skills: {
    id: string;
    description_pl: string | null;
    description_en: string | null;
    level: number;
    show_level: boolean | null;
    display_order: number;
    technologies: {
      name: string;
    } | null;
  }[];
};
