import ProfileSkeleton from "../components/about/ProfileSkeleton";
import ProfileContent from "../components/about/ProfileContent";
import ProfileImage from "../components/about/ProfileImage";
import type { Language } from "@shared/types/language";
import type { Profile } from "@shared/types/profile";

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
    <section
      id="about"
      className="flex scroll-mt-24 items-center py-16"
      aria-busy={isLoading}
    >
      <div className="grid w-full items-center gap-12 rounded-3xl border p-6 sm:p-10 lg:grid-cols-2 lg:p-16">
        {isLoading ? (
          <ProfileSkeleton />
        ) : isError || !profile ? (
          <div
            role="alert"
            className="col-span-full flex min-h-96 items-center justify-center text-center"
          >
            <p className="text-lg">{errorMessage}</p>
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
