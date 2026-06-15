import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ADMIN_BASE_PATH } from "@shared/config/routes";
import { AuthProvider } from "./auth/AuthProvider";
import SessionTimeout from "./auth/SessionTimeout";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SessionTimeout/>
      <BrowserRouter basename={ADMIN_BASE_PATH}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
