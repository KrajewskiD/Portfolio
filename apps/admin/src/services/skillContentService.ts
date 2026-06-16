import { supabase } from "@admin/lib/supabase";
import type { SkillGroupData } from "@shared/types/skill";

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

function mapSkillGroupRow(group: SkillGroupRow): SkillGroupData {
  return {
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
  };
}

export async function getAdminSkillGroups(): Promise<SkillGroupData[]> {
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

  return data.map(mapSkillGroupRow);
}

export async function saveAdminSkillGroups(
  groups: SkillGroupData[],
): Promise<void> {
  for (const [groupIndex, group] of groups.entries()) {
    const { error: groupError } = await supabase.from("skill_groups").upsert({
      id: group.id,
      title_pl: group.titlePl,
      title_en: group.titleEn,
      display_order: groupIndex + 1,
    });

    if (groupError) {
      throw groupError;
    }

    for (const [skillIndex, skill] of group.skills.entries()) {
      const { data: technology, error: technologyLookupError } = await supabase
        .from("technologies")
        .select("id")
        .eq("name", skill.name)
        .maybeSingle<{ id: string }>();

      if (technologyLookupError) {
        throw technologyLookupError;
      }

      let technologyId = technology?.id;

      if (!technologyId) {
        const { data: createdTechnology, error: technologyCreateError } =
          await supabase
            .from("technologies")
            .insert({ name: skill.name })
            .select("id")
            .single<{ id: string }>();

        if (technologyCreateError) {
          throw technologyCreateError;
        }

        technologyId = createdTechnology.id;
      }

      const { error: skillError } = await supabase.from("skills").upsert({
        id: skill.id,
        skill_group_id: group.id,
        technology_id: technologyId,
        description_pl: skill.descriptionPl,
        description_en: skill.descriptionEn,
        level: skill.level,
        display_order: skillIndex + 1,
      });

      if (skillError) {
        throw skillError;
      }
    }
  }
}
