import {
  getProfileFromDatabase,
  PROFILE_IMAGES_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";
import type { Profile } from "@shared/database/types/profile";

import { supabase } from "../lib/supabase";

const getProfileImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROFILE_IMAGES_BUCKET,
);

export function getProfile(): Promise<Profile> {
  return getProfileFromDatabase(supabase, getProfileImagePublicUrl);
}
