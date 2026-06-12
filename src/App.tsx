import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import type { Language } from "./types/language";
import { translations } from "./locales";
import { footerMock, navigationMock } from "./data/portfolio.mock";

function App() {
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
        footer={footerMock}
        footerText={translation.footer}
        navigationItems={navigationMock}
        navigationText={translation.navigation}
        language={language}
        onLanguageChange={setLanguage}
      >
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
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
