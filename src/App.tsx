import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { footerMock, navigationMock } from "./data/portfolio.mock";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import type { Language } from "./types/language";

function App() {
  const [language, setLanguage] = useState<Language>("pl");

  return (
    <BrowserRouter>
      <MainLayout
        footer={footerMock}
        navigationItems={navigationMock}
        language={language}
        onLanguageChange={setLanguage}
      >
        <Routes>
          <Route path="/" element={<HomePage language={language}/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;