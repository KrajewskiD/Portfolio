import { AdminLocalizedMarkdownField } from "@admin/components/ui/AdminLocalizedMarkdownField";
import { AdminLocalizedInput } from "@admin/components/ui/AdminLocalizedField";
import AdminTextField from "@admin/components/ui/AdminTextField";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";

type ProfileDetailsFieldsProps = {
  profile: Profile;
  language: Language;
  disabled?: boolean;
  onUpdate: (
    field:
      | "name"
      | "email"
      | "rolePl"
      | "roleEn"
      | "descriptionPl"
      | "descriptionEn",
    value: string,
  ) => void;
};

function ProfileDetailsFields({
  profile,
  language,
  disabled = false,
  onUpdate,
}: ProfileDetailsFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="admin-stack">
        <AdminTextField
          id="profile-name"
          label="Imię i nazwisko"
          value={profile.name}
          disabled={disabled}
          onChange={(value) => onUpdate("name", value)}
        />

        <AdminTextField
          id="profile-email"
          label="Email kontaktowy"
          type="email"
          value={profile.email}
          disabled={disabled}
          onChange={(value) => onUpdate("email", value)}
        />

        <AdminLocalizedInput
          id="profile-role"
          label="Stanowisko"
          language={language}
          disabled={disabled}
          source={profile}
          plKey="rolePl"
          enKey="roleEn"
          onChange={onUpdate}
        />

        <AdminLocalizedMarkdownField
          id="profile-description"
          label="Opis"
          language={language}
          disabled={disabled}
          source={profile}
          plKey="descriptionPl"
          enKey="descriptionEn"
          onChange={onUpdate}
        />
      </div>
    </div>
  );
}

export default ProfileDetailsFields;
