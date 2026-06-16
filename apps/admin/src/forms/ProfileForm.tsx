import AdminButton from "../components/ui/AdminButton";
import AdminField from "../components/ui/AdminField";
import AdminInput from "../components/ui/AdminInput";
import AdminPanel from "../components/ui/AdminPanel";
import AdminTextarea from "../components/ui/AdminTextarea";
import type { AdminFormProps } from "../types/adminForms";

type ProfileDraft = {
  name: string;
  rolePl: string;
  roleEn: string;
  descriptionPl: string;
  descriptionEn: string;
  imageAltPl: string;
  imageAltEn: string;
};

const profileDraft: ProfileDraft = {
  name: "Dawid Krajewski",
  rolePl: "Frontend Developer PL",
  roleEn: "Frontend Developer EN",
  descriptionPl: "Lorem ipsum dolor sit amet. PL",
  descriptionEn: "Lorem ipsum dolor sit amet. EN",
  imageAltPl: "Zdjęcie profilowe",
  imageAltEn: "Profile image",
};

function ProfileForm({ language }: AdminFormProps) {
  const roleValue =
    language === "pl" ? profileDraft.rolePl : profileDraft.roleEn;
  const descriptionValue =
    language === "pl" ? profileDraft.descriptionPl : profileDraft.descriptionEn;
  const imageAltValue =
    language === "pl" ? profileDraft.imageAltPl : profileDraft.imageAltEn;

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Profil</h2>
          <p className="mt-2 text-white/60">
            Edycja głównych danych sekcji o mnie.
          </p>
        </div>

        <AdminButton type="button">Zapisz</AdminButton>
      </header>

      <AdminPanel className="grid gap-5">
        <p className="font-mono text-sm text-white/40">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <AdminField id="profile-name" label="Imię i nazwisko">
          <AdminInput id="profile-name" defaultValue={profileDraft.name} />
        </AdminField>

        <AdminField id="profile-role" label="Rola">
          <AdminInput id="profile-role" defaultValue={roleValue} />
        </AdminField>

        <AdminField id="profile-description" label="Opis">
          <AdminTextarea
            id="profile-description"
            rows={5}
            defaultValue={descriptionValue}
          />
        </AdminField>

        <AdminField id="profile-image-alt" label="Opis alternatywny zdjęcia">
          <AdminInput id="profile-image-alt" defaultValue={imageAltValue} />
        </AdminField>
      </AdminPanel>
    </section>
  );
}

export default ProfileForm;
