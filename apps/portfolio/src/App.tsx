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
import { useProjects } from "./hooks/useProjects";

function detectPreferredLanguage(): Language {
  const preferredLanguages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];

  return preferredLanguages.some((language) =>
    language.toLowerCase().startsWith("pl"),
  )
    ? "pl"
    : "en";
}

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

  const {
    data: projects,
    isPending: areProjectsPending,
    isError: areProjectsError,
  } = useProjects();

  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "pl" || savedLanguage === "en") {
      return savedLanguage;
    }

    return detectPreferredLanguage();
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
        projects={projects}
        footerLinks={footerLinks}
        isProfileLoading={isProfileLoading}
        isProfileError={isProfileError}
        areFooterLinksLoading={areFooterLinksLoading}
        areFooterLinksError={areFooterLinksError}
        footerText={translation.footer}
        projectText={translation.projects}
        navigationItems={navigationData}
        navigationText={translation.navigation}
        headerText={translation.header}
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
                projects={projects}
                isProfileLoading={isProfileLoading}
                isProfileError={isProfileError}
                areProjectsPending={areProjectsPending}
                areProjectsError={areProjectsError}
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
