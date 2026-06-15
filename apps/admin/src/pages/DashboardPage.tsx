import { useState } from "react";
import { signOut } from "../services/authService";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

function DashboardPage() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage(undefined);

    try {
      await signOut();
      window.location.replace(getAdminUrl(adminRoute.login));
    } catch {
      setErrorMessage("Nie udało się wylogować. Spróbuj ponownie.");
      setIsSigningOut(false);
    }
  }

  return (
    <main>
      <h1>Panel administratora</h1>

      <button type="button" onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Wylogowywanie..." : "Wyloguj"}
      </button>

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default DashboardPage;
