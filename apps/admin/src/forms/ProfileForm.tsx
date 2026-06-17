import AdminButton from "@admin/components/ui/AdminButton";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import AdminTranslateButton from "@admin/components/ui/AdminTranslateButton";
import { profileDraft } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import { useTranslateField } from "@admin/hooks/useTranslateField";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import {
  getProfileImagePublicUrl,
  getAdminProfile,
  saveAdminProfile,
  uploadProfileImage,
  deleteProfileImage,
} from "@admin/services/profileContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { Profile } from "@shared/database/types/profile";
import { getOppositeLocalizedKey } from "@shared/utils/localizedField";
import { useCallback, useState } from "react";

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
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(
    null,
  );
  const [profileImageMarkedForRemoval, setProfileImageMarkedForRemoval] =
    useState(false);

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
    [pendingProfileImage, profileImageMarkedForRemoval],
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
  } = useAdminFormSave<Profile>({
    initialValue: profileDraft,
    loadValue: getAdminProfile,
    saveValue: saveAdminProfile,
    prepareBeforeSave,
  });

  function updateProfile(field: ProfileTextField, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const roleField = language === "pl" ? "rolePl" : "roleEn";
  const descriptionField =
    language === "pl" ? "descriptionPl" : "descriptionEn";
  const footerDescriptionField =
    language === "pl" ? "footerDescriptionPl" : "footerDescriptionEn";
  const imageAltField = language === "pl" ? "imageAltPl" : "imageAltEn";
  const formDisabled = isLoading || isSaving;

  const imageAltTranslate = useTranslateField({
    language,
    sourceText: profile[imageAltField],
    disabled: formDisabled,
    onApply: (text) =>
      updateProfile(getOppositeLocalizedKey(language, "imageAltPl", "imageAltEn"), text),
  });

  const roleTranslate = useTranslateField({
    language,
    sourceText: profile[roleField],
    disabled: formDisabled,
    onApply: (text) =>
      updateProfile(getOppositeLocalizedKey(language, "rolePl", "roleEn"), text),
  });

  const descriptionTranslate = useTranslateField({
    language,
    sourceText: profile[descriptionField],
    disabled: formDisabled,
    onApply: (text) =>
      updateProfile(
        getOppositeLocalizedKey(language, "descriptionPl", "descriptionEn"),
        text,
      ),
  });

  const footerDescriptionTranslate = useTranslateField({
    language,
    sourceText: profile[footerDescriptionField],
    disabled: formDisabled,
    onApply: (text) =>
      updateProfile(
        getOppositeLocalizedKey(
          language,
          "footerDescriptionPl",
          "footerDescriptionEn",
        ),
        text,
      ),
  });

  const bulkTranslate = useTranslateFields({
    language,
    disabled: formDisabled,
    fields: [
      {
        sourceText: profile[imageAltField],
        onApply: (text) =>
          updateProfile(
            getOppositeLocalizedKey(language, "imageAltPl", "imageAltEn"),
            text,
          ),
      },
      {
        sourceText: profile[roleField],
        onApply: (text) =>
          updateProfile(
            getOppositeLocalizedKey(language, "rolePl", "roleEn"),
            text,
          ),
      },
      {
        sourceText: profile[descriptionField],
        onApply: (text) =>
          updateProfile(
            getOppositeLocalizedKey(language, "descriptionPl", "descriptionEn"),
            text,
          ),
      },
      {
        sourceText: profile[footerDescriptionField],
        onApply: (text) =>
          updateProfile(
            getOppositeLocalizedKey(
              language,
              "footerDescriptionPl",
              "footerDescriptionEn",
            ),
            text,
          ),
      },
    ],
  });

  const isAnyTranslating =
    bulkTranslate.isTranslating ||
    imageAltTranslate.isTranslating ||
    roleTranslate.isTranslating ||
    descriptionTranslate.isTranslating ||
    footerDescriptionTranslate.isTranslating;

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Profil"
        description="Edytuj dane wyświetlane w sekcji „O mnie” oraz w stopce strony."
        actions={
          <AdminFormActions>
            <AdminTranslateButton
              language={language}
              disabled={formDisabled || isAnyTranslating}
              isLoading={bulkTranslate.isTranslating}
              title="Przetłumacz wszystkie pola przez Gemini AI"
              onClick={() => void bulkTranslate.onTranslateAll()}
            />
            <AdminButton
              type="button"
              variant="secondary"
              disabled={isLoading || isSaving || isAnyTranslating}
              onClick={() => void save()}
            >
              {isSaving ? "Zapisywanie..." : "Zapisz"}
            </AdminButton>
          </AdminFormActions>
        }
      />

      {bulkTranslate.error ? (
        <p role="alert" className="text-sm text-red-300">
          {bulkTranslate.error}
        </p>
      ) : null}

      {loadError ? (
        <p role="status" className="text-sm text-amber-300">
          {loadError}
        </p>
      ) : null}

      {saveError ? (
        <p role="alert" className="text-sm text-red-300">
          {saveError}
        </p>
      ) : null}

      {saveSuccess ? (
        <p role="status" className="text-sm text-emerald-300">
          Zmiany zostały zapisane.
        </p>
      ) : null}

      <AdminPanel>
        <p className="font-mono text-sm font-bold text-white/35">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="admin-image-column admin-image-column--fluid">
            <AdminImagePicker
              label="Zdjęcie profilowe"
              imageUrl={profile.imageUrl}
              selectedFile={pendingProfileImage}
              imageMarkedForRemoval={profileImageMarkedForRemoval}
              previewAlt={profile[imageAltField]}
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
              onTranslate={() => void imageAltTranslate.onTranslate()}
              translateDisabled={formDisabled || isAnyTranslating}
              isTranslating={imageAltTranslate.isTranslating}
              translateError={imageAltTranslate.error}
            >
              <AdminInput
                id="profile-image-alt"
                value={profile[imageAltField]}
                disabled={isLoading}
                onChange={(event) =>
                  updateProfile(imageAltField, event.target.value)
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
                  onChange={(event) =>
                    updateProfile("name", event.target.value)
                  }
                />
              </AdminField>

              <AdminTranslatableField
                id="profile-role"
                label="Stanowisko"
                language={language}
                onTranslate={() => void roleTranslate.onTranslate()}
                translateDisabled={formDisabled || isAnyTranslating}
                isTranslating={roleTranslate.isTranslating}
                translateError={roleTranslate.error}
              >
                <AdminInput
                  id="profile-role"
                  value={profile[roleField]}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateProfile(roleField, event.target.value)
                  }
                />
              </AdminTranslatableField>

              <AdminTranslatableField
                id="profile-description"
                label="Opis"
                language={language}
                onTranslate={() => void descriptionTranslate.onTranslate()}
                translateDisabled={formDisabled || isAnyTranslating}
                isTranslating={descriptionTranslate.isTranslating}
                translateError={descriptionTranslate.error}
              >
                <AdminTextarea
                  id="profile-description"
                  rows={5}
                  value={profile[descriptionField]}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateProfile(descriptionField, event.target.value)
                  }
                />
              </AdminTranslatableField>
            </div>

            <div className="mt-auto">
              <AdminTranslatableField
                id="profile-footer-description"
                label="Opis w stopce"
                language={language}
                onTranslate={() => void footerDescriptionTranslate.onTranslate()}
                translateDisabled={formDisabled || isAnyTranslating}
                isTranslating={footerDescriptionTranslate.isTranslating}
                translateError={footerDescriptionTranslate.error}
              >
                <AdminInput
                  id="profile-footer-description"
                  value={profile[footerDescriptionField]}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateProfile(footerDescriptionField, event.target.value)
                  }
                />
              </AdminTranslatableField>
            </div>
          </div>
        </div>
      </AdminPanel>
    </section>
  );
}

export default ProfileForm;
