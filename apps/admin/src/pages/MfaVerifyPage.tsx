import { useState } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";
import { verifyExistingMfa } from "../services/mfaService";
import AuthLayout from "../layouts/AuthLayout";
import MfaCodeInput from "../components/MfaCodeInput";

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
    <AuthLayout
      label="mfa_verify"
      title="Weryfikacja MFA"
      description="Podaj 6-cyfrowy kod z aplikacji uwierzytelniającej."
    >
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

      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading || code.length !== 6}
        className="rounded-full border border-white/30 px-5 py-3 font-bold transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? "Weryfikowanie..." : "Potwierdź"}
      </button>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </AuthLayout>
  );
}

export default MfaVerifyPage;
