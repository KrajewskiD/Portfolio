import { supabase } from "@admin/lib/supabase";
import {
  getMainPageFromDatabase,
  mapMainPageToRow,
} from "@shared/database/mainPage";
import type { MainPage } from "@shared/database/types/mainPage";

export async function getAdminMainPage(): Promise<MainPage> {
  return getMainPageFromDatabase(supabase);
}

export async function saveAdminMainPage(mainPage: MainPage): Promise<void> {
  const { error } = await supabase
    .from("main_page")
    .update(mapMainPageToRow(mainPage))
    .eq("id", 1);

  if (error) {
    throw error;
  }
}
