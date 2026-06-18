export type Skill = {
  id: string;
  name: string;
  level: number;
};

export type SkillGroupData = {
  id: string;
  titlePl: string;
  titleEn: string;
  skills: Skill[];
};
