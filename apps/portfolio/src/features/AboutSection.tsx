import ProfileSkeleton from "../components/about/ProfileSkeleton";
import ProfileContent from "../components/about/ProfileContent";
import ProfileImage from "../components/about/ProfileImage";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";

type AboutSectionProps = {
  profile?: Profile;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  label: string;
  noImage: string;
  language: Language;
};

function AboutSection({
  profile,
  isLoading,
  isError,
  errorMessage,
  label,
  noImage,
  language,
}: AboutSectionProps) {
  const role = profile
    ? language === "pl"
      ? profile.rolePl
      : profile.roleEn
    : "";

  const description = profile
    ? language === "pl"
      ? profile.descriptionPl
      : profile.descriptionEn
    : "";

  const imageAlt = profile
    ? language === "pl"
      ? profile.imageAltPl
      : profile.imageAltEn
    : "";

  return (
    <section id="about" className="site-section--hero" aria-busy={isLoading}>
      <div className="site-card--hero">
        {isLoading ? (
          <ProfileSkeleton />
        ) : isError || !profile ? (
          <div
            role="alert"
            className="col-span-full flex min-h-96 items-center justify-center text-center"
          >
            <p className="site-text-error">{errorMessage}</p>
          </div>
        ) : (
          <>
            <ProfileImage
              imageUrl={profile.imageUrl}
              alt={imageAlt}
              fallbackLabel={noImage}
            />

            <ProfileContent name={profile.name} role={role} label={label}>
              <p>{description}</p>
            </ProfileContent>
          </>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
