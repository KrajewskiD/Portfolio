import {
  getProfileFromDatabase,
  PROFILE_IMAGES_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";
import { hydrateProfileImage } from "@shared/database/profile/hydrateProfileImage";
import type { Profile } from "@shared/database/types/profile";

import { supabase } from "../lib/supabase";

const getProfileImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROFILE_IMAGES_BUCKET,
);

export async function getProfile(): Promise<Profile> {
  const profile = await getProfileFromDatabase(
    supabase,
    getProfileImagePublicUrl,
  );

  return hydrateProfileImage(supabase, profile, {
    getProfileImagePublicUrl,
  });
}
