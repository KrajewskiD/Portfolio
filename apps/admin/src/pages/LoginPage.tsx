import { useState } from "react";
import { signInWithGitHub } from "../services/authService";

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
    <main>
      <h1>Panel administratora</h1>

      <button type="button" onClick={handleSignIn}>
        Zaloguj przez GitHub
      </button>

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default LoginPage;
