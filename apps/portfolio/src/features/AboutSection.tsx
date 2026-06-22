import ProfileSkeleton from "../components/about/ProfileSkeleton";
import ProfileContent from "../components/about/ProfileContent";
import ProfileImage from "../components/about/ProfileImage";
import { useProfileEmailReveal } from "../hooks/useProfileEmailReveal";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";
import { getLocalizedField } from "@shared/utils/localizedField";

type AboutSectionProps = {
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  label: string;
  noImage: string;
  socialLinksLabel: string;
  emailLabel: string;
  copyEmailLabel: string;
  emailCopiedMessage: string;
  emailEmptyMessage: string;
  emailLoadErrorMessage: string;
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
  emailLabel,
  copyEmailLabel,
  emailCopiedMessage,
  emailEmptyMessage,
  emailLoadErrorMessage,
  language,
}: AboutSectionProps) {
  const {
    email,
    panelState,
    isCopied,
    isMailExpanded,
    isMailLoading,
    handleMailClick,
    handleCopyEmail,
  } = useProfileEmailReveal();

  const role = profile
    ? getLocalizedField(profile, language, "rolePl", "roleEn")
    : "";

  const description = profile
    ? getLocalizedField(profile, language, "descriptionPl", "descriptionEn")
    : "";

  const imageAlt = profile
    ? getLocalizedField(profile, language, "imageAltPl", "imageAltEn")
    : "";

  return (
    <section id="about" className="site-section--hero" aria-busy={isLoading}>
      {isLoading ? (
        <ProfileSkeleton />
      ) : isError || !profile ? (
        <div className="site-hero-card site-hero-card--error" role="alert">
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
            emailLabel={emailLabel}
            copyEmailLabel={copyEmailLabel}
            emailCopiedMessage={emailCopiedMessage}
            emailEmptyMessage={emailEmptyMessage}
            emailLoadErrorMessage={emailLoadErrorMessage}
            panelState={panelState}
            email={email}
            isCopied={isCopied}
            isMailExpanded={isMailExpanded}
            isMailLoading={isMailLoading}
            onMailClick={() => void handleMailClick()}
            onCopyEmail={() => void handleCopyEmail()}
          >
            <p>{description}</p>
          </ProfileContent>
        </div>
      )}
    </section>
  );
}

export default AboutSection;
