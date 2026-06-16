import { Navigate, Outlet } from "react-router";
import { useAuth } from "./useAuth";
import AuthErrorPage from "../pages/AuthErrorPage";

function ProtectedRoute() {
  const { session, authStatus, isLoading } = useAuth();

  if (isLoading) {
    return null;
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
