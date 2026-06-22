import { useMfaVerify } from "@admin/hooks/auth/useMfaVerify";
import AuthLayout from "../layouts/AuthLayout";
import AuthButton from "../components/AuthButton";
import MfaCodeInput from "../components/MfaCodeInput";

function MfaVerifyPage() {
  const { code, setCode, errorMessage, isLoading, verify } = useMfaVerify();

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

      <AuthButton
        type="button"
        onClick={() => void verify()}
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? "Weryfikowanie..." : "Potwierdź"}
      </AuthButton>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </AuthLayout>
  );
}

export default MfaVerifyPage;
