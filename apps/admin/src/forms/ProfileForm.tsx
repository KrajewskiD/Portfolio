import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { profileDraft } from "@admin/data/adminDrafts";
import { createProfileTranslateFields } from "@admin/forms/profileTranslatableFields";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { usePendingSingleImage } from "@admin/hooks/usePendingSingleImage";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
import {
  deleteProfileImage,
  getAdminProfile,
  getProfileImagePublicUrl,
  saveAdminProfile,
  uploadProfileImage,
} from "@admin/services/profileContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { Profile } from "@shared/database/types/profile";
import {
  getLocalizedField,
  getLocalizedKey,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";
import { useCallback, useMemo } from "react";

type ProfileTextField =
  | "name"
  | "rolePl"
  | "roleEn"
  | "descriptionPl"
  | "descriptionEn"
  | "footerDescriptionPl"
  | "footerDescriptionEn"
  | "imageAltPl"
  | "imageAltEn";

function ProfileForm({ language }: AdminFormProps) {
  const {
    pendingFile: pendingProfileImage,
    setPendingFile: setPendingProfileImage,
    markedForRemoval: profileImageMarkedForRemoval,
    setMarkedForRemoval: setProfileImageMarkedForRemoval,
    hasPendingEdits: hasPendingImageEdits,
    discardPending: discardPendingImage,
  } = usePendingSingleImage();

  const prepareBeforeSave = useCallback(
    async (currentProfile: Profile) => {
      let nextProfile = currentProfile;

      if (profileImageMarkedForRemoval && currentProfile.imagePath) {
        await deleteProfileImage(currentProfile.imagePath);
        nextProfile = {
          ...currentProfile,
          imagePath: undefined,
          imageUrl: undefined,
        };
      }

      if (pendingProfileImage) {
        const imagePath = await uploadProfileImage(pendingProfileImage);
        setPendingProfileImage(null);

        nextProfile = {
          ...nextProfile,
          imagePath,
          imageUrl: getProfileImagePublicUrl(imagePath),
        };
      }

      setProfileImageMarkedForRemoval(false);
      return nextProfile;
    },
    [
      pendingProfileImage,
      profileImageMarkedForRemoval,
      setPendingProfileImage,
      setProfileImageMarkedForRemoval,
    ],
  );

  const {
    value: profile,
    setValue: setProfile,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminForm<Profile>({
    initialValue: profileDraft,
    loadValue: getAdminProfile,
    saveValue: saveAdminProfile,
    prepareBeforeSave,
    extraDirty: hasPendingImageEdits,
    onDiscard: discardPendingImage,
  });

  const { isOverlayOpen } = useTranslationOverlay();

  function updateProfile(field: ProfileTextField, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const formDisabled = isLoading || isSaving || isOverlayOpen;

  const bulkTranslateFields = useMemo(
    () =>
      createProfileTranslateFields(profile, language, (field, text) =>
        updateProfile(field, text),
      ),
    [language, profile],
  );

  const bulkTranslate = useTranslateFields({
    language,
    disabled: formDisabled,
    fields: bulkTranslateFields,
  });

  const applyOppositeField =
    (plKey: ProfileTextField, enKey: ProfileTextField) => (text: string) =>
      updateProfile(getOppositeLocalizedKey(language, plKey, enKey), text);

  return (
    <AdminFormShell
      title="Profil"
      description="Edytuj dane wyświetlane w sekcji „O mnie” oraz w stopce strony."
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      extraErrors={bulkTranslate.error ? [bulkTranslate.error] : []}
      actions={
        <AdminFormActions>
          <AdminFormSaveActions
            language={language}
            saveDisabled={formDisabled}
            isSaving={isSaving}
            onSave={save}
            translateDisabled={formDisabled}
            isBulkTranslating={bulkTranslate.isTranslating}
            translateTitle="Przetłumacz wszystkie pola przez Gemini AI"
            onTranslateAll={bulkTranslate.onTranslateAll}
          />
        </AdminFormActions>
      }
    >
      <AdminEditLanguageBanner language={language} />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="admin-image-column admin-image-column--fluid">
          <AdminImagePicker
            label="Zdjęcie profilowe"
            imageUrl={profile.imageUrl}
            selectedFile={pendingProfileImage}
            imageMarkedForRemoval={profileImageMarkedForRemoval}
            previewAlt={getLocalizedField(
              profile,
              language,
              "imageAltPl",
              "imageAltEn",
            )}
            emptyLabel="Brak zdjęcia profilowego"
            disabled={isLoading || isSaving}
            onFileSelect={(file) => {
              setPendingProfileImage(file);
              if (file) {
                setProfileImageMarkedForRemoval(false);
              }
            }}
            onImageMarkedForRemovalChange={setProfileImageMarkedForRemoval}
          />

          <AdminTranslatableField
            id="profile-image-alt"
            label="Opis alternatywny zdjęcia"
            language={language}
            disabled={formDisabled}
            sourceText={getLocalizedField(
              profile,
              language,
              "imageAltPl",
              "imageAltEn",
            )}
            onApply={applyOppositeField("imageAltPl", "imageAltEn")}
          >
            <AdminInput
              id="profile-image-alt"
              value={getLocalizedField(
                profile,
                language,
                "imageAltPl",
                "imageAltEn",
              )}
              disabled={isLoading}
              onChange={(event) =>
                updateProfile(
                  getLocalizedKey(language, "imageAltPl", "imageAltEn"),
                  event.target.value,
                )
              }
            />
          </AdminTranslatableField>
        </div>

        <div className="flex flex-col gap-6">
          <div className="admin-stack">
            <AdminField id="profile-name" label="Imię i nazwisko">
              <AdminInput
                id="profile-name"
                value={profile.name}
                disabled={isLoading}
                onChange={(event) => updateProfile("name", event.target.value)}
              />
            </AdminField>

            <AdminTranslatableField
              id="profile-role"
              label="Stanowisko"
              language={language}
              disabled={formDisabled}
              sourceText={getLocalizedField(
                profile,
                language,
                "rolePl",
                "roleEn",
              )}
              onApply={applyOppositeField("rolePl", "roleEn")}
            >
              <AdminInput
                id="profile-role"
                value={getLocalizedField(profile, language, "rolePl", "roleEn")}
                disabled={isLoading}
                onChange={(event) =>
                  updateProfile(
                    getLocalizedKey(language, "rolePl", "roleEn"),
                    event.target.value,
                  )
                }
              />
            </AdminTranslatableField>

            <AdminTranslatableField
              id="profile-description"
              label="Opis"
              language={language}
              disabled={formDisabled}
              sourceText={getLocalizedField(
                profile,
                language,
                "descriptionPl",
                "descriptionEn",
              )}
              onApply={applyOppositeField("descriptionPl", "descriptionEn")}
            >
              <AdminTextarea
                id="profile-description"
                rows={5}
                value={getLocalizedField(
                  profile,
                  language,
                  "descriptionPl",
                  "descriptionEn",
                )}
                disabled={isLoading}
                onChange={(event) =>
                  updateProfile(
                    getLocalizedKey(language, "descriptionPl", "descriptionEn"),
                    event.target.value,
                  )
                }
              />
            </AdminTranslatableField>
          </div>

          <div className="mt-auto">
            <AdminTranslatableField
              id="profile-footer-description"
              label="Opis w stopce"
              language={language}
              disabled={formDisabled}
              sourceText={getLocalizedField(
                profile,
                language,
                "footerDescriptionPl",
                "footerDescriptionEn",
              )}
              onApply={applyOppositeField(
                "footerDescriptionPl",
                "footerDescriptionEn",
              )}
            >
              <AdminInput
                id="profile-footer-description"
                value={getLocalizedField(
                  profile,
                  language,
                  "footerDescriptionPl",
                  "footerDescriptionEn",
                )}
                disabled={isLoading}
                onChange={(event) =>
                  updateProfile(
                    getLocalizedKey(
                      language,
                      "footerDescriptionPl",
                      "footerDescriptionEn",
                    ),
                    event.target.value,
                  )
                }
              />
            </AdminTranslatableField>
          </div>
        </div>
      </div>
    </AdminFormShell>
  );
}

export default ProfileForm;
