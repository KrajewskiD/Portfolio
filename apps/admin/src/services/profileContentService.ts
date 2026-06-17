import { getProfileFromDatabase } from "@shared/database";
import { mapProfileToRow } from "@shared/database/profile/profileMapper";
import { supabase } from "@admin/lib/supabase";
import {
  deleteProfileImage,
  getProfileImagePublicUrl,
  uploadProfileImage,
} from "@admin/lib/imageStorage";
import type { Profile } from "@shared/database/types/profile";

export async function getAdminProfile(): Promise<Profile> {
  return getProfileFromDatabase(supabase, getProfileImagePublicUrl);
}

export async function saveAdminProfile(profile: Profile): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update(mapProfileToRow(profile))
    .eq("id", 1);

  if (error) {
    throw error;
  }
}

export { uploadProfileImage, getProfileImagePublicUrl, deleteProfileImage };
