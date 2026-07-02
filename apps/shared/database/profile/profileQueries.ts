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
  image_path,
  image_alt_pl,
  image_alt_en
`;

const ADMIN_PROFILE_SELECT = `
  ${PROFILE_SELECT},
  email
`;

export async function getProfileFromDatabase(
  supabase: SupabaseClient,
  getProfileImagePublicUrl: (path: string) => string,
  options: { includeEmail?: boolean } = {},
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(options.includeEmail ? ADMIN_PROFILE_SELECT : PROFILE_SELECT)
    .eq("id", 1)
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  return mapProfileRow(data, getProfileImagePublicUrl);
}
