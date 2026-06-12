import type { ReactNode } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import SystemControls from "../components/language/SystemControls";
import type { FooterData } from "../types/footer";
import type { Language } from "../types/language";
import type { NavigationLinkData } from "../types/link";

type MainLayoutProps = {
  children: ReactNode;
  footer: FooterData;
  navigationItems: NavigationLinkData[];
  language: Language;
  onLanguageChange: (language: Language) => void;
};

function MainLayout({
  children,
  footer,
  navigationItems,
  language,
  onLanguageChange,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SystemControls
        language={language}
        onLanguageChange={onLanguageChange}
      />

      <Header
        navigationItems={navigationItems}
        language={language}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4">
        {children}
      </main>

      <Footer footer={footer} />
    </div>
  );
}

export default MainLayout;