import { getProfileFromDatabase } from "@shared/database";
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
    .update({
      name: profile.name,
      role_pl: profile.rolePl,
      role_en: profile.roleEn,
      description_pl: profile.descriptionPl,
      description_en: profile.descriptionEn,
      footer_description_pl: profile.footerDescriptionPl,
      footer_description_en: profile.footerDescriptionEn,
      image_path: profile.imagePath ?? null,
      image_alt_pl: profile.imageAltPl,
      image_alt_en: profile.imageAltEn,
    })
    .eq("id", 1);

  if (error) {
    throw error;
  }
}

export { uploadProfileImage, getProfileImagePublicUrl, deleteProfileImage };
