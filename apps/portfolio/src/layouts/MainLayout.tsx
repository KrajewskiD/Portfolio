import type { ReactNode } from "react";

import Footer from "@portfolio/components/Footer";
import Header from "@portfolio/components/Header";
import TopToolbar from "@portfolio/components/toolbar/TopToolbar";
import type { Translations } from "@portfolio/locales/translations";
import type { FooterData } from "@shared/database/types/footer";
import type { Language } from "@shared/database/types/language";
import type { FooterLinkData, NavigationLinkData } from "@shared/database/types/link";
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
    <div className="flex min-h-screen flex-col">
      <TopToolbar language={language} onLanguageChange={onLanguageChange} />

      <Header
        navigationItems={navigationItems}
        language={language}
        navigationText={navigationText}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4">{children}</main>

      <Footer
        footer={footer}
        isLoading={isProfileLoading || areFooterLinksLoading}
        isError={isProfileError && areFooterLinksError}
        socialLinksLabel={footerText.socialLinksLabel}
      />
    </div>
  );
}

export default MainLayout;
