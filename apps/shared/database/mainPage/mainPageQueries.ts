import type { SupabaseClient } from "@supabase/supabase-js";

import type { MainPage } from "../types/mainPage";
import { mapMainPageRow } from "./mainPageMapper";
import type { MainPageRow } from "./mainPageRows";

const MAIN_PAGE_SELECT = `
  about_site_code,
  about_site_project_url,
  about_site_title_pl,
  about_site_title_en,
  about_site_technologies,
  about_site_topics
`;

export async function getMainPageFromDatabase(
  supabase: SupabaseClient,
): Promise<MainPage> {
  const { data, error } = await supabase
    .from("main_page")
    .select(MAIN_PAGE_SELECT)
    .eq("id", 1)
    .single<MainPageRow>();

  if (error) {
    throw error;
  }

  return mapMainPageRow(data);
}
