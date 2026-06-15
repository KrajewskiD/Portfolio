import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

function MfaRoute() {
  const { mfaStatus, isLoading } = useAuth();

  if (isLoading || !mfaStatus) {
    return <p>Sprawdzanie MFA...</p>;
  }

  if (mfaStatus === "unenrolled") {
    return <Navigate to="/mfa/setup" replace />;
  }

  if (mfaStatus === "unverified") {
    return <Navigate to="/mfa/verify" replace />;
  }

  return <Outlet />;
}

export default MfaRoute;
