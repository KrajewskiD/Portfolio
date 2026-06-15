import { supabase } from "../lib/supabase";
import type { Profile } from "../types/profile";

type ProfileRow = {
  name: string;
  role_pl: string;
  role_en: string;
  description_pl: string;
  description_en: string;
  image_path: string | null;
  image_alt_pl: string | null;
  image_alt_en: string | null;
};

export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      name,
      role_pl,
      role_en,
      description_pl,
      description_en,
      image_path,
      image_alt_pl,
      image_alt_en
    `)
    .eq("id", 1)
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  const imageUrl = data.image_path
    ? supabase.storage
        .from("profile-images")
        .getPublicUrl(data.image_path).data.publicUrl
    : undefined;

  return {
    name: data.name,
    rolePl: data.role_pl,
    roleEn: data.role_en,
    descriptionPl: data.description_pl,
    descriptionEn: data.description_en,
    imageUrl,
    imageAltPl: data.image_alt_pl ?? "",
    imageAltEn: data.image_alt_en ?? "",
  };
}