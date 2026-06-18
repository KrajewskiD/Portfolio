import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import type { Language } from "@shared/database/types/language";
import { translations } from "./locales";
import { navigationData } from "./data/navigation.data";
import { useProfile } from "./hooks/useProfile";
import { useFooterLinks } from "./hooks/useFooterLinks";

function App() {
  const {
    data: profile,
    isPending: isProfileLoading,
    isError: isProfileError,
  } = useProfile();
  const {
    data: footerLinks,
    isPending: areFooterLinksLoading,
    isError: areFooterLinksError,
  } = useFooterLinks();

  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "pl" || savedLanguage === "en") {
      return savedLanguage;
    }

    return navigator.language.startsWith("pl") ? "pl" : "en";
  });

  const translation = translations[language];
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <BrowserRouter>
      <MainLayout
        profile={profile}
        footerLinks={footerLinks}
        isProfileLoading={isProfileLoading}
        isProfileError={isProfileError}
        areFooterLinksLoading={areFooterLinksLoading}
        areFooterLinksError={areFooterLinksError}
        footerText={translation.footer}
        navigationItems={navigationData}
        navigationText={translation.navigation}
        language={language}
        onLanguageChange={setLanguage}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                language={language}
                profile={profile}
                footerLinks={footerLinks}
                isProfileLoading={isProfileLoading}
                isProfileError={isProfileError}
                socialLinksLabel={translation.footer.socialLinksLabel}
              />
            }
          />
          <Route
            path="*"
            element={
              <NotFoundPage
                message={translation.notFound.message}
                backHome={translation.notFound.backHome}
              />
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
