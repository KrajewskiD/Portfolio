import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";
import { verifyExistingMfa } from "../services/mfaService";

function MfaVerifyPage() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleVerify() {
    if (code.length !== 6) return;

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
  }

  return (
    <main>
      <h1>Weryfikacja MFA</h1>

      <label htmlFor="mfa-code">Kod z aplikacji</label>
      <input
        id="mfa-code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
      />

      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? "Weryfikowanie..." : "Potwierdź"}
      </button>

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default MfaVerifyPage;
