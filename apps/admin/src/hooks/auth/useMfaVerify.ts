import { useCallback, useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import { verifyExistingMfa } from "@admin/services/mfaService";

export function useMfaVerify() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const verify = useCallback(async () => {
    if (code.length !== 6) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await verifyExistingMfa(code);
      window.location.replace(getAdminUrl(adminRoute.dashboard));
    } catch {
      setErrorMessage("Kod jest nieprawidłowy lub wygasł.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return {
    code,
    setCode,
    errorMessage,
    isLoading,
    verify,
  };
}
