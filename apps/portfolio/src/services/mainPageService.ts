import { getMainPageFromDatabase } from "@shared/database/mainPage";
import type { MainPage } from "@shared/database/types/mainPage";

import { supabase } from "../lib/supabase";

export async function getMainPage(): Promise<MainPage> {
  return getMainPageFromDatabase(supabase);
}
