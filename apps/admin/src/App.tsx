import { Navigate, Route, Routes } from "react-router";

import MfaRoute from "./auth/MfaRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MfaSetupPage from "./pages/MfaSetupPage";
import MfaVerifyPage from "./pages/MfaVerifyPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MfaRoute />}>
          <Route path="/mfa/setup" element={<MfaSetupPage />} />
          <Route path="/mfa/verify" element={<MfaVerifyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/unauthorized" replace />} />
    </Routes>
  );
}

export default App;
