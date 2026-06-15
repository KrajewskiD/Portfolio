import { useState } from "react";
import { signInWithGitHub } from "../services/authService";
import AuthLayout from "../layouts/AuthLayout";

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSignIn() {
    setErrorMessage(undefined);

    try {
      await signInWithGitHub();
    } catch {
      setErrorMessage("Nie udało się rozpocząć logowania.");
    }
  }

  return (
    <AuthLayout
      label="admin_access"
      title="Panel administratora"
      description="Zaloguj się kontem GitHub, aby zarządzać treścią portfolio."
    >
      <button
        type="button"
        onClick={handleSignIn}
        className="rounded-full border border-white/30 px-5 py-3 font-bold transition hover:bg-white hover:text-black"
      >
        Zaloguj przez GitHub
      </button>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </AuthLayout>
  );
}

export default LoginPage;
