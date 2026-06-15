import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";
import {
  enrollMfa,
  verifyMfa,
  type MfaEnrollment,
} from "../services/mfaService";
import AuthLayout from "../layouts/AuthLayout";
import MfaCodeInput from "../components/MfaCodeInput";
import AuthButton from "../components/AuthButton";

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
    <AuthLayout
      label="mfa_setup"
      title="Konfiguracja MFA"
      description="Zeskanuj kod QR w aplikacji uwierzytelniającej, a potem wpisz 6-cyfrowy kod."
    >
      {!enrollment ? (
        <button
          type="button"
          onClick={handleEnroll}
          disabled={isLoading}
          className="rounded-full border border-white/30 px-5 py-3 font-bold transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "Generowanie..." : "Skonfiguruj MFA"}
        </button>
      ) : (
        <>
          <div className="rounded-3xl border border-white/20 bg-white p-4">
            <img
              src={enrollment.qrCode}
              alt="Kod QR do konfiguracji uwierzytelniania"
              className="mx-auto size-56"
            />
          </div>

          <p className="text-sm leading-6 text-white/70">
            Kod ręczny:{" "}
            <code className="break-all font-mono text-white">
              {enrollment.secret}
            </code>
          </p>

          <label htmlFor="mfa-code" className="text-sm font-bold text-white/70">
            Kod z aplikacji
          </label>

          <MfaCodeInput
            id="mfa-code"
            value={code}
            onChange={setCode}
            disabled={isLoading}
            autoFocus
          />

          <AuthButton type="button" onClick={handleEnroll} disabled={isLoading}>
            {isLoading ? "Generowanie..." : "Skonfiguruj MFA"}
          </AuthButton>
        </>
      )}

      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </AuthLayout>
  );
}

export default MfaSetupPage;
