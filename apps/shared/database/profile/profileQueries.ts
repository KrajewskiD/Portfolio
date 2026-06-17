import type { SupabaseClient } from "@supabase/supabase-js";

import type { Profile } from "../types/profile";
import { mapProfileRow } from "./profileMapper";
import type { ProfileRow } from "./profileRows";

const PROFILE_SELECT = `
  name,
  role_pl,
  role_en,
  description_pl,
  description_en,
  footer_description_pl,
  footer_description_en,
  image_path,
  image_alt_pl,
  image_alt_en
`;

export async function getProfileFromDatabase(
  supabase: SupabaseClient,
  getProfileImagePublicUrl: (path: string) => string,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", 1)
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  return mapProfileRow(data, getProfileImagePublicUrl);
}
