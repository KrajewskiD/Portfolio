import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";
import AuthErrorPage from "../pages/AuthErrorPage";

function ProtectedRoute() {
  const { session, authStatus, isLoading } = useAuth();

  if (isLoading) {
    return <p>Sprawdzanie uprawnień...</p>;
  }

  if (authStatus === "error") {
    return <AuthErrorPage />;
  }

  if (!session) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
