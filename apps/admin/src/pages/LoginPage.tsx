import { useState } from "react";
import { signInWithGitHub } from "../services/authService";
import AuthLayout from "../layouts/AuthLayout";
import AuthButton from "../components/AuthButton";
import LoadingDots from "../components/LoadingDots";

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await signInWithGitHub();
    } catch {
      setErrorMessage("Nie udało się rozpocząć logowania.");
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      label="admin_access"
      title="Panel administratora"
      description="Zaloguj się kontem GitHub, aby zarządzać treścią portfolio."
    >
      <AuthButton type="button" onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? (
          <>
            Logowanie
            <LoadingDots />
          </>
        ) : (
          "Zaloguj przez GitHub"
        )}
      </AuthButton>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </AuthLayout>
  );
}

export default LoginPage;
