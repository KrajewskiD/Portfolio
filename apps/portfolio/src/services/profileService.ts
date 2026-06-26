import {
  getProfileFromDatabase,
  PROFILE_IMAGES_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";
import { hydrateProfileImage } from "@shared/database/profile/hydrateProfileImage";
import type { Profile } from "@shared/database/types/profile";

import { supabase } from "../lib/supabase";
import { getWithLocalStorageCache } from "../utils/localStorageCache";
import {
  PUBLIC_CONTENT_CACHE_TTL_MS,
  publicContentCacheKeys,
} from "../utils/publicContentCache";
import { isValidProfile } from "../utils/publicContentCacheValidators";

const getProfileImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROFILE_IMAGES_BUCKET,
);

async function fetchProfile(): Promise<Profile> {
  const profile = await getProfileFromDatabase(
    supabase,
    getProfileImagePublicUrl,
  );

  return hydrateProfileImage(supabase, profile, {
    getProfileImagePublicUrl,
  });
}

export async function getProfile(): Promise<Profile> {
  return getWithLocalStorageCache(
    publicContentCacheKeys.profile,
    PUBLIC_CONTENT_CACHE_TTL_MS,
    fetchProfile,
    { validate: isValidProfile },
  );
}
