import ProfileSkeleton from "../components/about/ProfileSkeleton";
import ProfileContent from "../components/about/ProfileContent";
import ProfileDescription from "../components/about/ProfileDescription";
import ProfileImage from "../components/about/ProfileImage";
import { useProfileEmailReveal } from "../hooks/useProfileEmailReveal";
import type { Translations } from "@portfolio/locales/translations";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";
import { getLocalizedField } from "@shared/utils/localizedField";

type AboutSectionProps = {
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isLoading: boolean;
  isError: boolean;
  text: Translations["about"];
  socialLinksLabel: string;
  language: Language;
};

function AboutSection({
  profile,
  footerLinks,
  isLoading,
  isError,
  text,
  socialLinksLabel,
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
          <p className="site-text-error">{text.loadError}</p>
        </div>
      ) : (
        <div className="site-hero-card">
          <ProfileImage
            imageUrl={profile.imageUrl}
            alt={imageAlt}
            fallbackLabel={text.noImage}
          />

          <ProfileContent
            name={profile.name}
            role={role}
            label={text.label}
            links={footerLinks}
            socialLinksLabel={socialLinksLabel}
            emailLabel={text.emailLabel}
            copyEmailLabel={text.copyEmailLabel}
            emailCopiedMessage={text.emailCopiedMessage}
            emailEmptyMessage={text.emailEmptyMessage}
            emailLoadErrorMessage={text.emailLoadErrorMessage}
            panelState={panelState}
            email={email}
            isCopied={isCopied}
            isMailExpanded={isMailExpanded}
            isMailLoading={isMailLoading}
            onMailClick={() => void handleMailClick()}
            onCopyEmail={() => void handleCopyEmail()}
          >
            <ProfileDescription
              text={description}
              expandLabel={text.readMore}
              collapseLabel={text.readLess}
            />
          </ProfileContent>
        </div>
      )}
    </section>
  );
}

export default AboutSection;
