import { useCallback, useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import {
  enrollMfa,
  verifyMfa,
  type MfaEnrollment,
} from "@admin/services/mfaService";

export function useMfaSetup() {
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const enroll = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      setEnrollment(await enrollMfa());
    } catch {
      setErrorMessage("Nie udało się rozpocząć konfiguracji MFA.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verify = useCallback(async () => {
    if (!enrollment || code.length !== 6) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await verifyMfa(enrollment.factorId, code);
      window.location.replace(getAdminUrl(adminRoute.dashboard));
    } catch {
      setErrorMessage("Kod jest nieprawidłowy lub wygasł.");
    } finally {
      setIsLoading(false);
    }
  }, [code, enrollment]);

  return {
    enrollment,
    code,
    setCode,
    errorMessage,
    isLoading,
    enroll,
    verify,
  };
}
