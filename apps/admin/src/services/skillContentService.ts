import {
  getSkillGroupsFromDatabase,
  getOrCreateTechnologyId,
} from "@shared/database";
import { supabase } from "@admin/lib/supabase";
import type { SkillGroupData } from "@shared/database/types/skill";

export async function getAdminSkillGroups(): Promise<SkillGroupData[]> {
  return getSkillGroupsFromDatabase(supabase);
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
      const technologyId = await getOrCreateTechnologyId(supabase, skill.name);

      const { error: skillError } = await supabase.from("skills").upsert({
        id: skill.id,
        group_id: group.id,
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
