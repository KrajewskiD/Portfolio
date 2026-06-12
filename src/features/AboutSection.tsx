import ProfileContent from "../components/about/ProfileContent";
import ProfileImage from "../components/about/ProfileImage";
import type { Profile } from "../types/profile";
import type { Language } from "../types/language";

type AboutSectionProps = {
  profile: Profile;
  label: string;
  noImage: string;
  language: Language;
};

function AboutSection({
  profile,
  label,
  noImage,
  language,
}: AboutSectionProps) {
  const role = language === "pl" ? profile.rolePl : profile.roleEn;
  const description =
    language === "pl" ? profile.descriptionPl : profile.descriptionEn;
  const imageAlt = language === "pl" ? profile.imageAltPl : profile.imageAltEn;

  return (
    <section id="about" className="flex scroll-mt-24 items-center py-16">
      <div className="grid w-full items-center gap-12 rounded-3xl border p-6 sm:p-10 lg:grid-cols-2 lg:p-16">
        <ProfileImage
          imageUrl={profile.imageUrl}
          alt={imageAlt}
          fallbackLabel={noImage}
        />

        <ProfileContent name={profile.name} role={role} label={label}>
          <p>{description}</p>
        </ProfileContent>
      </div>
    </section>
  );
}

export default AboutSection;
