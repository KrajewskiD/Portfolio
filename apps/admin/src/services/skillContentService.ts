import {
  getSkillGroupsFromDatabase,
  getOrCreateTechnologyId,
} from "@shared/database";
import {
  mapSkillGroupToRow,
  mapSkillToRow,
} from "@shared/database/skills/skillMapper";
import { supabase } from "@admin/lib/supabase";
import type { SkillGroupData } from "@shared/database/types/skill";

export async function getAdminSkillGroups(): Promise<SkillGroupData[]> {
  return getSkillGroupsFromDatabase(supabase);
}

export async function saveAdminSkillGroups(
  groups: SkillGroupData[],
): Promise<void> {
  for (const [groupIndex, group] of groups.entries()) {
    const { error: groupError } = await supabase
      .from("skill_groups")
      .upsert(mapSkillGroupToRow(group, groupIndex + 1));

    if (groupError) {
      throw groupError;
    }

    for (const [skillIndex, skill] of group.skills.entries()) {
      const technologyId = await getOrCreateTechnologyId(supabase, skill.name);

      const { error: skillError } = await supabase
        .from("skills")
        .upsert(mapSkillToRow(skill, group.id, technologyId, skillIndex + 1));

      if (skillError) {
        throw skillError;
      }
    }
  }
}
