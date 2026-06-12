export type Skill = {
  id: string;
  name: string;
  description: string;
  level: number;
};

export type SkillGroupData = {
  id: string;
  title: string;
  skills: Skill[];
};