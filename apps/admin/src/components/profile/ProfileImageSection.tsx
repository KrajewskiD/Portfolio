import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import { AdminLocalizedInput } from "@admin/components/ui/AdminLocalizedField";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";
import { getLocalizedField } from "@shared/utils/localizedField";

type ProfileImageSectionProps = {
  profile: Profile;
  language: Language;
  pendingFile: File | null;
  imageMarkedForRemoval: boolean;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange: (marked: boolean) => void;
  onUpdateImageAlt: (field: "imageAltPl" | "imageAltEn", value: string) => void;
};

function ProfileImageSection({
  profile,
  language,
  pendingFile,
  imageMarkedForRemoval,
  disabled = false,
  onFileSelect,
  onImageMarkedForRemovalChange,
  onUpdateImageAlt,
}: ProfileImageSectionProps) {
  return (
    <div className="admin-image-column admin-image-column--fluid">
      <AdminImagePicker
        label="Zdjęcie profilowe"
        hint="Zapisuje się wyłącznie w buckecie profile-images jako profile/avatar.webp. Nie ma związku z miniaturami projektów."
        imageUrl={profile.imageUrl}
        selectedFile={pendingFile}
        imageMarkedForRemoval={imageMarkedForRemoval}
        previewAlt={getLocalizedField(
          profile,
          language,
          "imageAltPl",
          "imageAltEn",
        )}
        emptyLabel="Brak zdjęcia profilowego"
        disabled={disabled}
        onFileSelect={onFileSelect}
        onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
      />

      <AdminLocalizedInput
        id="profile-image-alt"
        label="Opis alternatywny zdjęcia"
        language={language}
        disabled={disabled}
        source={profile}
        plKey="imageAltPl"
        enKey="imageAltEn"
        onChange={onUpdateImageAlt}
      />
    </div>
  );
}

export default ProfileImageSection;
