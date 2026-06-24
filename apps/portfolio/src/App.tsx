import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import type { Language } from "@shared/database/types/language";
import { translations } from "./locales";
import { navigationData } from "./data/navigation.data";
import { useMainPage } from "./hooks/useMainPage";
import { useProfile } from "./hooks/useProfile";
import { useFooterLinks } from "./hooks/useFooterLinks";
import { useProjects } from "./hooks/useProjects";
import { useSkillGroups } from "./hooks/useSkillGroups";
import {
  getLanguageFromUrl,
  scrollToHashSection,
  updateLanguageUrl,
} from "./utils/languageUrl";

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
  const {
    data: skillGroups,
    isPending: areSkillGroupsPending,
    isError: areSkillGroupsError,
  } = useSkillGroups();
  const { data: mainPage } = useMainPage();

  const [language, setLanguage] = useState<Language>(() => {
    return getLanguageFromUrl() ?? detectPreferredLanguage();
  });

  const translation = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    function syncLanguageFromUrl() {
      const urlLanguage = getLanguageFromUrl();

      if (urlLanguage) {
        setLanguage(urlLanguage);
      }

      scrollToHashSection();
    }

    syncLanguageFromUrl();

    window.addEventListener("hashchange", syncLanguageFromUrl);
    window.addEventListener("popstate", syncLanguageFromUrl);

    return () => {
      window.removeEventListener("hashchange", syncLanguageFromUrl);
      window.removeEventListener("popstate", syncLanguageFromUrl);
    };
  }, []);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    updateLanguageUrl(nextLanguage);
  };

  const homePage = (
    <HomePage
      language={language}
      profile={profile}
      footerLinks={footerLinks}
      projects={projects}
      skillGroups={skillGroups}
      isProfileLoading={isProfileLoading}
      isProfileError={isProfileError}
      areProjectsPending={areProjectsPending}
      areProjectsError={areProjectsError}
      areSkillGroupsPending={areSkillGroupsPending}
      areSkillGroupsError={areSkillGroupsError}
      socialLinksLabel={translation.footer.socialLinksLabel}
    />
  );

  return (
    <BrowserRouter>
      <MainLayout
        mainPage={mainPage}
        profile={profile}
        footerLinks={footerLinks}
        isProfileLoading={isProfileLoading}
        isProfileError={isProfileError}
        areFooterLinksLoading={areFooterLinksLoading}
        areFooterLinksError={areFooterLinksError}
        footerText={translation.footer}
        aboutText={translation.about}
        projectText={translation.projects}
        navigationItems={navigationData}
        navigationText={translation.navigation}
        headerText={translation.header}
        language={language}
        onLanguageChange={handleLanguageChange}
      >
        <Routes>
          <Route path="/" element={homePage} />
          <Route path="/pl" element={homePage} />
          <Route path="/en" element={homePage} />
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
