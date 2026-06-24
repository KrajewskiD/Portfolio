import { type ReactNode, useRef } from "react";

import Footer from "@portfolio/components/Footer";
import Header from "@portfolio/components/Header";
import NoiseBackground from "@portfolio/components/NoiseBackground";
import ParchmentScroll from "@portfolio/components/ParchmentScroll";
import useCardGradientVariation from "@portfolio/hooks/useCardGradientVariation";
import type { Translations } from "@portfolio/locales/translations";
import {
  buildFeaturedProject,
  buildFooterData,
} from "@portfolio/utils/mainLayoutViewModels";
import type { Language } from "@shared/database/types/language";
import type {
  FooterLinkData,
  NavigationLinkData,
} from "@shared/database/types/link";
import type { MainPage } from "@shared/database/types/mainPage";
import type { Profile } from "@shared/database/types/profile";

type MainLayoutProps = {
  children: ReactNode;
  mainPage?: MainPage;
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isProfileLoading: boolean;
  isProfileError: boolean;
  areFooterLinksLoading: boolean;
  areFooterLinksError: boolean;
  footerText: Translations["footer"];
  aboutText: Translations["about"];
  projectText: Translations["projects"];
  navigationItems: NavigationLinkData[];
  headerText: Translations["header"];
  language: Language;
  navigationText: Translations["navigation"];
  onLanguageChange: (language: Language) => void;
};

function MainLayout({
  children,
  mainPage,
  profile,
  footerLinks,
  isProfileLoading,
  isProfileError,
  areFooterLinksLoading,
  areFooterLinksError,
  footerText,
  aboutText,
  projectText,
  navigationItems,
  language,
  navigationText,
  headerText,
  onLanguageChange,
}: MainLayoutProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useCardGradientVariation();

  const footer = buildFooterData({ footerLinks, language, profile });
  const featuredProject = buildFeaturedProject(mainPage);

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
            emailText={aboutText}
            socialLinksLabel={footerText.socialLinksLabel}
          />
        </div>
      </ParchmentScroll>

      <div id="site-portal-root" />
    </div>
  );
}

export default MainLayout;
