import ProfileSkeleton from "../components/about/ProfileSkeleton";
import ProfileContent from "../components/about/ProfileContent";
import ProfileImage from "../components/about/ProfileImage";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";

type AboutSectionProps = {
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  label: string;
  noImage: string;
  socialLinksLabel: string;
  language: Language;
};

function AboutSection({
  profile,
  footerLinks,
  isLoading,
  isError,
  errorMessage,
  label,
  noImage,
  socialLinksLabel,
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
            className="flex min-h-72 items-center justify-center p-8 text-center"
          >
            <p className="site-text-error">{errorMessage}</p>
          </div>
        ) : (
          <div className="site-hero-card">
            <ProfileImage
              imageUrl={profile.imageUrl}
              alt={imageAlt}
              fallbackLabel={noImage}
            />

            <ProfileContent
              name={profile.name}
              role={role}
              label={label}
              links={footerLinks}
              socialLinksLabel={socialLinksLabel}
            >
              <p>{description}</p>
            </ProfileContent>
          </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
