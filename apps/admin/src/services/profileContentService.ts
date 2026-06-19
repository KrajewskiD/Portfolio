import { assertValidProfileImagePath, getProfileFromDatabase } from "@shared/database";
import { hydrateProfileImage } from "@shared/database/profile/hydrateProfileImage";
import { mapProfileToRow } from "@shared/database/profile/profileMapper";
import { supabase } from "@admin/lib/supabase";
import {
  deleteProfileImage,
  getProfileImagePublicUrl,
  uploadProfileImage,
} from "@admin/lib/imageStorage";
import type { Profile } from "@shared/database/types/profile";

export async function getAdminProfile(): Promise<Profile> {
  const profile = await getProfileFromDatabase(supabase, getProfileImagePublicUrl, {
    includeEmail: true,
  });

  return hydrateProfileImage(supabase, profile, {
    getProfileImagePublicUrl,
    syncDatabase: true,
  });
}

export async function saveAdminProfile(profile: Profile): Promise<void> {
  if (profile.imagePath) {
    assertValidProfileImagePath(profile.imagePath);
  }

  const { error } = await supabase
    .from("profiles")
    .update(mapProfileToRow(profile))
    .eq("id", 1);

  if (error) {
    throw error;
  }
}

export {
  uploadProfileImage,
  getProfileImagePublicUrl,
  getVersionedProfileImageUrl,
  deleteProfileImage,
} from "@admin/lib/imageStorage";
