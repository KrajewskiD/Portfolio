export type Skill = {
  id: string;
  name: string;
  level: number;
  showLevel: boolean;
};

export type SkillGroupData = {
  id: string;
  titlePl: string;
  titleEn: string;
  skills: Skill[];
};
