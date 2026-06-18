import { type ReactNode, useRef } from "react";

import Footer from "@portfolio/components/Footer";
import Header from "@portfolio/components/Header";
import NoiseBackground from "@portfolio/components/NoiseBackground";
import ParchmentScroll from "@portfolio/components/ParchmentScroll";
import TopToolbar from "@portfolio/components/toolbar/TopToolbar";
import useCardGradientVariation from "@portfolio/hooks/useCardGradientVariation";
import type { Translations } from "@portfolio/locales/translations";
import type { FooterData } from "@shared/database/types/footer";
import type { Language } from "@shared/database/types/language";
import type {
  FooterLinkData,
  NavigationLinkData,
} from "@shared/database/types/link";
import type { Profile } from "@shared/database/types/profile";

type MainLayoutProps = {
  children: ReactNode;
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isProfileLoading: boolean;
  isProfileError: boolean;
  areFooterLinksLoading: boolean;
  areFooterLinksError: boolean;
  footerText: Translations["footer"];
  navigationItems: NavigationLinkData[];
  language: Language;
  navigationText: Translations["navigation"];
  onLanguageChange: (language: Language) => void;
};

function MainLayout({
  children,
  profile,
  footerLinks,
  isProfileLoading,
  isProfileError,
  areFooterLinksLoading,
  areFooterLinksError,
  footerText,
  navigationItems,
  language,
  navigationText,
  onLanguageChange,
}: MainLayoutProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useCardGradientVariation();

  const footer: FooterData | undefined =
    profile || footerLinks?.length
      ? {
          name: profile?.name ?? "",
          description: profile
            ? language === "pl"
              ? profile.footerDescriptionPl
              : profile.footerDescriptionEn
            : "",
          links: footerLinks ?? [],
        }
      : undefined;

  return (
    <div className="site-layout">
      <NoiseBackground />

      <div className="site-chrome">
        <div className="site-chrome__row">
          <TopToolbar language={language} onLanguageChange={onLanguageChange} />

          <Header
            navigationItems={navigationItems}
            language={language}
            navigationText={navigationText}
          />
        </div>
      </div>

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
