import { Navigate, Outlet, useLocation } from "react-router";
import { adminRoute } from "@shared/config/routes";
import { useAuth } from "./useAuth";
import type { MfaStatus } from "../services/mfaService";

const routeByMfaStatus: Record<MfaStatus, string> = {
  unenrolled: adminRoute.mfaSetup,
  unverified: adminRoute.mfaVerify,
  verified: adminRoute.dashboard,
};

function MfaRoute() {
  const { mfaStatus, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading || !mfaStatus) {
    return null;
  }

  const requiredRoute = routeByMfaStatus[mfaStatus];

  if (location.pathname !== requiredRoute) {
    return <Navigate to={requiredRoute} replace />;
  }

  return <Outlet />;
}

export default MfaRoute;
