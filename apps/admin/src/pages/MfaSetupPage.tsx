import { useMfaSetup } from "@admin/hooks/auth/useMfaSetup";
import AuthLayout from "../layouts/AuthLayout";
import MfaCodeInput from "../components/MfaCodeInput";
import AuthButton from "../components/AuthButton";

function MfaSetupPage() {
  const { enrollment, code, setCode, errorMessage, isLoading, enroll, verify } =
    useMfaSetup();

  return (
    <AuthLayout
      label="mfa_setup"
      title="Konfiguracja MFA"
      description="Zeskanuj kod QR w aplikacji uwierzytelniającej, a potem wpisz 6-cyfrowy kod."
    >
      {!enrollment ? (
        <button
          type="button"
          onClick={() => void enroll()}
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

          <AuthButton
            type="button"
            onClick={() => void verify()}
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "Weryfikowanie..." : "Zweryfikuj i przejdz dalej"}
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
