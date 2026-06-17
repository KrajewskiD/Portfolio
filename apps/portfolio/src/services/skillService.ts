import { supabase } from "../lib/supabase";
import type { SkillGroupData } from "@shared/database/types/skill";

type SkillGroupRow = {
  id: string;
  title_pl: string;
  title_en: string;
  display_order: number;
  skills: {
    id: string;
    description_pl: string | null;
    description_en: string | null;
    level: number;
    display_order: number;
    technologies: {
      name: string;
    } | null;
  }[];
};

export async function getSkillGroups(): Promise<SkillGroupData[]> {
  const { data, error } = await supabase
    .from("skill_groups")
    .select(
      `
      id,
      title_pl,
      title_en,
      display_order,
      skills (
        id,
        description_pl,
        description_en,
        level,
        display_order,
        technologies (
          name
        )
      )
    `,
    )
    .order("display_order", { ascending: true })
    .overrideTypes<SkillGroupRow[]>();

  if (error) {
    throw error;
  }

  return data.map((group) => ({
    id: group.id,
    titlePl: group.title_pl,
    titleEn: group.title_en,
    skills: group.skills
      .toSorted((first, second) => first.display_order - second.display_order)
      .flatMap((skill) =>
        skill.technologies
          ? [
              {
                id: skill.id,
                name: skill.technologies.name,
                descriptionPl: skill.description_pl ?? "",
                descriptionEn: skill.description_en ?? "",
                level: skill.level,
              },
            ]
          : [],
      ),
  }));
}
