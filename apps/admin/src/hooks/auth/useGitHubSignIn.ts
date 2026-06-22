import { useCallback, useState } from "react";

import { signInWithGitHub } from "@admin/services/authService";

export function useGitHubSignIn() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await signInWithGitHub();
    } catch {
      setErrorMessage("Nie udało się rozpocząć logowania.");
      setIsLoading(false);
    }
  }, []);

  return {
    errorMessage,
    isLoading,
    signIn,
  };
}
