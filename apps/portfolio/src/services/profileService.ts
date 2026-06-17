import {
  getProfileFromDatabase,
  PROFILE_IMAGES_BUCKET,
  getStoragePublicUrl,
} from "@shared/database";
import type { Profile } from "@shared/database/types/profile";

import { supabase } from "../lib/supabase";

function getProfileImagePublicUrl(path: string): string {
  return getStoragePublicUrl(supabase, PROFILE_IMAGES_BUCKET, path);
}

export function getProfile(): Promise<Profile> {
  return getProfileFromDatabase(supabase, getProfileImagePublicUrl);
}
