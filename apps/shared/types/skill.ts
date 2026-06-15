export type Skill = {
  id: string;
  name: string;
  descriptionPl: string;
  descriptionEn: string;
  level: number;
};

export type SkillGroupData = {
  id: string;
  titlePl: string;
  titleEn: string;
  skills: Skill[];
};
