import { useCallback, useState } from "react";

const MFA_CODE_LENGTH = 6;
const MFA_INVALID_CODE_MESSAGE = "Kod jest nieprawidłowy lub wygasł.";

type UseMfaCodeSubmitParams = {
  submit: (code: string) => Promise<void>;
  canSubmit?: boolean;
};

export function useMfaCodeSubmit({
  submit,
  canSubmit = true,
}: UseMfaCodeSubmitParams) {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const verify = useCallback(async () => {
    if (!canSubmit || code.length !== MFA_CODE_LENGTH) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await submit(code);
    } catch {
      setErrorMessage(MFA_INVALID_CODE_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [canSubmit, code, submit]);

  return {
    code,
    setCode,
    errorMessage,
    isLoading,
    verify,
  };
}
