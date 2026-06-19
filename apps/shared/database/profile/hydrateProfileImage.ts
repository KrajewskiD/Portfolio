import type { SupabaseClient } from "@supabase/supabase-js";

import type { Profile } from "../types/profile";
import { PROFILE_IMAGES_BUCKET } from "../storage/storageUrls";
import { resolveStorageImageUrl } from "../storage/resolveStorageImageUrl";

type HydrateProfileImageOptions = {
  getProfileImagePublicUrl: (path: string) => string;
  syncDatabase?: boolean;
};

export async function hydrateProfileImage(
  supabase: SupabaseClient,
  profile: Profile,
  {
    getProfileImagePublicUrl,
    syncDatabase = false,
  }: HydrateProfileImageOptions,
): Promise<Profile> {
  if (!profile.imagePath) {
    return {
      ...profile,
      imageUrl: undefined,
    };
  }

  const imageUrl = await resolveStorageImageUrl(
    supabase,
    PROFILE_IMAGES_BUCKET,
    profile.imagePath,
    getProfileImagePublicUrl,
  );

  if (imageUrl) {
    return {
      ...profile,
      imageUrl,
    };
  }

  if (syncDatabase) {
    const { error } = await supabase
      .from("profiles")
      .update({ image_path: null })
      .eq("id", 1);

    if (error) {
      throw error;
    }
  }

  return {
    ...profile,
    imagePath: undefined,
    imageUrl: undefined,
  };
}
