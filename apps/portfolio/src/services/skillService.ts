import { getSkillGroupsFromDatabase } from "@shared/database";

import { supabase } from "../lib/supabase";

export function getSkillGroups() {
  return getSkillGroupsFromDatabase(supabase);
}
