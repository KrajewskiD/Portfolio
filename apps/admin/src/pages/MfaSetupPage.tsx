import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";
import {
  enrollMfa,
  verifyMfa,
  type MfaEnrollment,
} from "../services/mfaService";

function MfaSetupPage() {
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleEnroll() {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      setEnrollment(await enrollMfa());
    } catch {
      setErrorMessage("Nie udało się rozpocząć konfiguracji MFA.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (!enrollment || code.length !== 6) return;

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
  }

  return (
    <main>
      <h1>Konfiguracja MFA</h1>

      {!enrollment ? (
        <button type="button" onClick={handleEnroll} disabled={isLoading}>
          {isLoading ? "Generowanie..." : "Skonfiguruj MFA"}
        </button>
      ) : (
        <>
          <img
            src={enrollment.qrCode}
            alt="Kod QR do konfiguracji uwierzytelniania"
          />

          <p>
            Kod ręczny: <code>{enrollment.secret}</code>
          </p>

          <label htmlFor="mfa-code">Kod z aplikacji</label>
          <input
            id="mfa-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
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
        </>
      )}

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default MfaSetupPage;
