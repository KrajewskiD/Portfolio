import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

function ProtectedRoute() {
  const { session, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <p>Sprawdzanie uprawnień...</p>;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
