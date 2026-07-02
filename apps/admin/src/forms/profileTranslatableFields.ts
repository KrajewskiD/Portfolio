import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";

import {
  createTranslateFields,
  type LocalizedFieldConfig,
} from "@admin/forms/createTranslateFields";
import type { TranslateFieldItem } from "@admin/hooks/useTranslateFields";

type ProfileLocalizedKey =
  | "rolePl"
  | "roleEn"
  | "descriptionPl"
  | "descriptionEn"
  | "imageAltPl"
  | "imageAltEn";

const profileTranslatableFieldConfigs: LocalizedFieldConfig<ProfileLocalizedKey>[] =
  [
    { id: "profile-image-alt", plKey: "imageAltPl", enKey: "imageAltEn" },
    { id: "profile-role", plKey: "rolePl", enKey: "roleEn" },
    {
      id: "profile-description",
      plKey: "descriptionPl",
      enKey: "descriptionEn",
    },
  ];

export function createProfileTranslateFields(
  profile: Profile,
  language: Language,
  onApply: (field: ProfileLocalizedKey, text: string) => void,
): TranslateFieldItem[] {
  return createTranslateFields(
    profile,
    language,
    profileTranslatableFieldConfigs,
    onApply,
  );
}
