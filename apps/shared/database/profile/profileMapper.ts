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
