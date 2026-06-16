import AdminButton from "@admin/components/ui/AdminButton";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { profileDraft } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import {
  getProfileImagePublicUrl,
  getAdminProfile,
  saveAdminProfile,
  uploadProfileImage,
} from "@admin/services/profileContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { Profile } from "@shared/types/profile";
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

  const prepareBeforeSave = useCallback(
    async (currentProfile: Profile) => {
      if (!pendingProfileImage) {
        return currentProfile;
      }

      const imagePath = await uploadProfileImage(pendingProfileImage);
      setPendingProfileImage(null);

      return {
        ...currentProfile,
        imagePath,
        imageUrl: getProfileImagePublicUrl(imagePath),
      };
    },
    [pendingProfileImage],
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

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Profil"
        description="Edytuj dane wyświetlane w sekcji „O mnie” oraz w stopce strony."
        actions={
          <AdminFormActions>
            <AdminButton
              type="button"
              variant="secondary"
              disabled={isLoading || isSaving}
              onClick={() => void save()}
            >
              {isSaving ? "Zapisywanie..." : "Zapisz"}
            </AdminButton>
          </AdminFormActions>
        }
      />

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
              previewAlt={profile[imageAltField]}
              emptyLabel="Brak zdjęcia profilowego"
              disabled={isLoading || isSaving}
              onFileSelect={setPendingProfileImage}
            />

            <AdminTranslatableField
              id="profile-image-alt"
              label="Opis alternatywny zdjęcia"
              language={language}
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
