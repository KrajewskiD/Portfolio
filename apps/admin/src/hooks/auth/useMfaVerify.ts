import { useCallback } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import { useMfaCodeSubmit } from "@admin/hooks/auth/useMfaCodeSubmit";
import { verifyExistingMfa } from "@admin/services/mfaService";

export function useMfaVerify() {
  const submit = useCallback(async (code: string) => {
    await verifyExistingMfa(code);
    window.location.replace(getAdminUrl(adminRoute.dashboard));
  }, []);

  return useMfaCodeSubmit({ submit });
}
