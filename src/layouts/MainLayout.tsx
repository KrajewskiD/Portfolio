import type { ReactNode } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import TopToolbar from "../components/toolbar/TopToolbar";
import type { FooterData } from "../types/footer";
import type { Language } from "../types/language";
import type { NavigationLinkData } from "../types/link";
import type { Translations } from "../locales/translations";

type MainLayoutProps = {
  children: ReactNode;
  footer: FooterData;
  footerText: Translations["footer"];
  navigationItems: NavigationLinkData[];
  language: Language;
  navigationText: Translations["navigation"];
  onLanguageChange: (language: Language) => void;
};

function MainLayout({
  children,
  footer,
  footerText,
  navigationItems,
  language,
  navigationText,
  onLanguageChange,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopToolbar language={language} onLanguageChange={onLanguageChange} />

      <Header
        navigationItems={navigationItems}
        language={language}
        navigationText={navigationText}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4">{children}</main>

      <Footer footer={footer} socialLinksLabel={footerText.socialLinksLabel} />
    </div>
  );
}

export default MainLayout;
