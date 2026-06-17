import { supabase } from "@admin/lib/supabase";
import {
  deleteProfileImage,
  getProfileImagePublicUrl,
  uploadProfileImage,
} from "@admin/lib/imageStorage";
import type { Profile } from "@shared/database/types/profile";

type ProfileRow = {
  name: string;
  role_pl: string;
  role_en: string;
  description_pl: string;
  description_en: string;
  footer_description_pl: string | null;
  footer_description_en: string | null;
  image_path: string | null;
  image_alt_pl: string | null;
  image_alt_en: string | null;
};

function mapProfileRow(data: ProfileRow): Profile {
  const imagePath = data.image_path ?? undefined;
  const imageUrl = imagePath ? getProfileImagePublicUrl(imagePath) : undefined;

  return {
    name: data.name,
    rolePl: data.role_pl,
    roleEn: data.role_en,
    descriptionPl: data.description_pl,
    descriptionEn: data.description_en,
    footerDescriptionPl: data.footer_description_pl ?? "",
    footerDescriptionEn: data.footer_description_en ?? "",
    imagePath,
    imageUrl,
    imageAltPl: data.image_alt_pl ?? "",
    imageAltEn: data.image_alt_en ?? "",
  };
}

export async function getAdminProfile(): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
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
    `,
    )
    .eq("id", 1)
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  return mapProfileRow(data);
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
