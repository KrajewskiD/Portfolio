import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import ProfileDetailsFields from "@admin/components/profile/ProfileDetailsFields";
import ProfileImageSection from "@admin/components/profile/ProfileImageSection";
import { profileDraft } from "@admin/data/adminDrafts";
import { createProfileTranslateFields } from "@admin/forms/profileTranslatableFields";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { usePendingSingleImage } from "@admin/hooks/usePendingSingleImage";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  deleteProfileImage,
  getAdminProfile,
  getVersionedProfileImageUrl,
  saveAdminProfile,
  uploadProfileImage,
} from "@admin/services/profileContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { Profile } from "@shared/database/types/profile";
import { useCallback, useMemo } from "react";

type ProfileTextField =
  | "name"
  | "email"
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
    pendingFileRef: pendingProfileImageRef,
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

      if (pendingProfileImageRef.current) {
        const imagePath = await uploadProfileImage(
          pendingProfileImageRef.current,
        );
        setPendingProfileImage(null);

        nextProfile = {
          ...nextProfile,
          imagePath,
          imageUrl: await getVersionedProfileImageUrl(imagePath),
        };
      }

      setProfileImageMarkedForRemoval(false);
      return nextProfile;
    },
    [
      pendingProfileImageRef,
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
    isDirty,
  } = useAdminForm<Profile>({
    initialValue: profileDraft,
    loadValue: getAdminProfile,
    saveValue: saveAdminProfile,
    prepareBeforeSave,
    extraDirty: hasPendingImageEdits,
    onDiscard: discardPendingImage,
  });

  const { isOverlayOpen } = useTranslationOverlay();

  const updateProfile = useCallback(
    (field: ProfileTextField, value: string) => {
      setProfile((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [setProfile],
  );

  const formDisabled = isLoading || isSaving || isOverlayOpen;

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
            saveDisabled={formDisabled || !isDirty}
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
        <ProfileImageSection
          profile={profile}
          language={language}
          pendingFile={pendingProfileImage}
          imageMarkedForRemoval={profileImageMarkedForRemoval}
          disabled={isLoading || isSaving}
          onFileSelect={(file) => {
            setPendingProfileImage(file);
            if (file) {
              setProfileImageMarkedForRemoval(false);
            }
          }}
          onImageMarkedForRemovalChange={setProfileImageMarkedForRemoval}
          onUpdateImageAlt={updateProfile}
        />

        <ProfileDetailsFields
          profile={profile}
          language={language}
          disabled={formDisabled}
          onUpdate={updateProfile}
        />
      </div>
    </AdminFormShell>
  );
}

export default ProfileForm;
