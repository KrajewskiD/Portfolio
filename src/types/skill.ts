export type Skill = {
  name: string;
  description: string;
  level: number;
};

export type SkillGroupData = {
  title: string;
  skills: Skill[];
};