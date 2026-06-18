import type { Profile } from "../types/profile";
import type { ProfileRow } from "./profileRows";

export function mapProfileRow(
  data: ProfileRow,
  getProfileImagePublicUrl: (path: string) => string,
): Profile {
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

export function mapProfileToRow(profile: Profile): Omit<ProfileRow, never> {
  return {
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
  };
}
