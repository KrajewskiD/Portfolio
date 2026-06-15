import { useState } from "react";
import { useNavigate } from "react-router";

import { signOut } from "../services/authService";

function DashboardPage() {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage(undefined);

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      setErrorMessage("Nie udało się wylogować. Spróbuj ponownie.");
      setIsSigningOut(false);
    }
  }

  return (
    <main>
      <h1>Panel administratora</h1>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
      </button>

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default DashboardPage;