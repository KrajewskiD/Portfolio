import { useCallback, useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import { useMfaCodeSubmit } from "@admin/hooks/auth/useMfaCodeSubmit";
import {
  enrollMfa,
  verifyMfa,
  type MfaEnrollment,
} from "@admin/services/mfaService";

export function useMfaSetup() {
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [enrollErrorMessage, setEnrollErrorMessage] = useState<string>();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const submit = useCallback(
    async (code: string) => {
      if (!enrollment) {
        return;
      }

      await verifyMfa(enrollment.factorId, code);
      window.location.replace(getAdminUrl(adminRoute.dashboard));
    },
    [enrollment],
  );

  const {
    code,
    setCode,
    errorMessage: verifyErrorMessage,
    isLoading: isVerifying,
    verify,
  } = useMfaCodeSubmit({
    submit,
    canSubmit: Boolean(enrollment),
  });

  const enroll = useCallback(async () => {
    setIsEnrolling(true);
    setEnrollErrorMessage(undefined);

    try {
      setEnrollment(await enrollMfa());
    } catch {
      setEnrollErrorMessage("Nie udało się rozpocząć konfiguracji MFA.");
    } finally {
      setIsEnrolling(false);
    }
  }, []);

  return {
    enrollment,
    code,
    setCode,
    errorMessage: enrollErrorMessage ?? verifyErrorMessage,
    isLoading: isEnrolling || isVerifying,
    enroll,
    verify,
  };
}
