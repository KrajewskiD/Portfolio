import { useCallback, useMemo } from "react";

import { createProfileTranslateFields } from "@admin/forms/profileTranslatableFields";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";
import type { Dispatch, SetStateAction } from "react";

export type ProfileTextField =
  | "name"
  | "email"
  | "rolePl"
  | "roleEn"
  | "descriptionPl"
  | "descriptionEn"
  | "imageAltPl"
  | "imageAltEn";

type UseProfileEditorParams = {
  language: Language;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  formDisabled: boolean;
};

export function useProfileEditor({
  language,
  profile,
  setProfile,
  formDisabled,
}: UseProfileEditorParams) {
  const updateProfile = useCallback(
    (field: ProfileTextField, value: string) => {
      setProfile((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [setProfile],
  );

  const bulkTranslateFields = useMemo(
    () =>
      createProfileTranslateFields(profile, language, (field, text) =>
        updateProfile(field, text),
      ),
    [language, profile, updateProfile],
  );

  const bulkTranslate = useTranslateFields({
    language,
    disabled: formDisabled,
    fields: bulkTranslateFields,
  });

  return {
    updateProfile,
    bulkTranslate,
  };
}
