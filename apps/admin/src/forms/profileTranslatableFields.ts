import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";
import {
  getLocalizedField,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

import type { TranslateFieldItem } from "@admin/hooks/useTranslateFields";

type ProfileLocalizedKey =
  | "rolePl"
  | "roleEn"
  | "descriptionPl"
  | "descriptionEn"
  | "footerDescriptionPl"
  | "footerDescriptionEn"
  | "imageAltPl"
  | "imageAltEn";

type ProfileTranslatableFieldConfig = {
  id: string;
  plKey: ProfileLocalizedKey;
  enKey: ProfileLocalizedKey;
};

export const profileTranslatableFields: ProfileTranslatableFieldConfig[] = [
  {
    id: "profile-image-alt",
    plKey: "imageAltPl",
    enKey: "imageAltEn",
  },
  {
    id: "profile-role",
    plKey: "rolePl",
    enKey: "roleEn",
  },
  {
    id: "profile-description",
    plKey: "descriptionPl",
    enKey: "descriptionEn",
  },
  {
    id: "profile-footer-description",
    plKey: "footerDescriptionPl",
    enKey: "footerDescriptionEn",
  },
];

export function createProfileTranslateFields(
  profile: Profile,
  language: Language,
  onApply: (field: ProfileLocalizedKey, text: string) => void,
): TranslateFieldItem[] {
  return profileTranslatableFields.map((field) => ({
    id: field.id,
    sourceText: getLocalizedField(profile, language, field.plKey, field.enKey),
    onApply: (text) =>
      onApply(
        getOppositeLocalizedKey(language, field.plKey, field.enKey),
        text,
      ),
  }));
}

export function getProfileLocalizedField(
  profile: Profile,
  language: Language,
  plKey: ProfileLocalizedKey,
  enKey: ProfileLocalizedKey,
) {
  return getLocalizedField(profile, language, plKey, enKey);
}
