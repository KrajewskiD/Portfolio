import type { ReactNode } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import TopToolbar from "../components/toolbar/TopToolbar";
import type { Translations } from "../locales/translations";
import type { FooterData } from "@shared/types/footer";
import type { Language } from "@shared/types/language";
import type { FooterLinkData, NavigationLinkData } from "@shared/types/link";
import type { Profile } from "@shared/types/profile";

type MainLayoutProps = {
  children: ReactNode;
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isFooterLoading: boolean;
  isFooterError: boolean;
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
  isFooterLoading,
  isFooterError,
  footerText,
  navigationItems,
  language,
  navigationText,
  onLanguageChange,
}: MainLayoutProps) {
  const footer: FooterData | undefined = profile
    ? {
        name: profile.name,
        description:
          language === "pl"
            ? profile.footerDescriptionPl
            : profile.footerDescriptionEn,
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
        isLoading={isFooterLoading}
        isError={isFooterError}
        socialLinksLabel={footerText.socialLinksLabel}
      />
    </div>
  );
}

export default MainLayout;
