import { type ReactNode, useRef } from "react";

import Footer from "@portfolio/components/Footer";
import Header from "@portfolio/components/Header";
import NoiseBackground from "@portfolio/components/NoiseBackground";
import ParchmentScroll from "@portfolio/components/ParchmentScroll";
import useCardGradientVariation from "@portfolio/hooks/useCardGradientVariation";
import type { Translations } from "@portfolio/locales/translations";
import type { FooterData } from "@shared/database/types/footer";
import type { Language } from "@shared/database/types/language";
import type {
  FooterLinkData,
  NavigationLinkData,
} from "@shared/database/types/link";
import type { Profile } from "@shared/database/types/profile";
import type { Project } from "@shared/database/types/project";
import { getLocalizedField } from "@shared/utils/localizedField";

type MainLayoutProps = {
  children: ReactNode;
  profile?: Profile;
  projects?: Project[];
  footerLinks?: FooterLinkData[];
  isProfileLoading: boolean;
  isProfileError: boolean;
  areFooterLinksLoading: boolean;
  areFooterLinksError: boolean;
  footerText: Translations["footer"];
  projectText: Translations["projects"];
  navigationItems: NavigationLinkData[];
  headerText: Translations["header"];
  language: Language;
  navigationText: Translations["navigation"];
  onLanguageChange: (language: Language) => void;
};

function MainLayout({
  children,
  profile,
  projects,
  footerLinks,
  isProfileLoading,
  isProfileError,
  areFooterLinksLoading,
  areFooterLinksError,
  footerText,
  projectText,
  navigationItems,
  language,
  navigationText,
  headerText,
  onLanguageChange,
}: MainLayoutProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useCardGradientVariation();

  const footer: FooterData | undefined =
    profile || footerLinks?.length
      ? {
          name: profile?.name ?? "",
          description: profile
            ? getLocalizedField(
                profile,
                language,
                "footerDescriptionPl",
                "footerDescriptionEn",
              )
            : "",
          links: footerLinks ?? [],
        }
      : undefined;

  const featuredProject = projects?.[0];

  return (
    <div className="site-layout">
      <NoiseBackground />

      <Header
        navigationItems={navigationItems}
        language={language}
        navigationText={navigationText}
        headerText={headerText}
        projectText={projectText}
        featuredProject={featuredProject}
        onLanguageChange={onLanguageChange}
      />

      <ParchmentScroll tiltRef={tiltRef}>
        <div ref={tiltRef} className="site-parchment-tilt">
          <main className="site-main">{children}</main>

          <Footer
            footer={footer}
            isLoading={isProfileLoading || areFooterLinksLoading}
            isError={isProfileError && areFooterLinksError}
            socialLinksLabel={footerText.socialLinksLabel}
          />
        </div>
      </ParchmentScroll>
    </div>
  );
}

export default MainLayout;
