import type { SupabaseClient } from "@supabase/supabase-js";

import type { SkillGroupData } from "../types/skill";
import { mapSkillGroupRow } from "./skillMapper";
import type { SkillGroupRow } from "./skillRows";

const SKILL_GROUPS_SELECT = `
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
`;

export async function getSkillGroupsFromDatabase(
  supabase: SupabaseClient,
): Promise<SkillGroupData[]> {
  const { data, error } = await supabase
    .from("skill_groups")
    .select(SKILL_GROUPS_SELECT)
    .order("display_order", { ascending: true })
    .overrideTypes<SkillGroupRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapSkillGroupRow);
}
