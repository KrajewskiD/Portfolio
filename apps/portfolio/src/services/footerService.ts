import { getFooterLinksFromDatabase } from "@shared/database";

import { supabase } from "../lib/supabase";

export function getFooterLinks() {
  return getFooterLinksFromDatabase(supabase);
}
