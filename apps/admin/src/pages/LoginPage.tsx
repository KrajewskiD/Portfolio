import { useGitHubSignIn } from "@admin/hooks/auth/useGitHubSignIn";
import AuthLayout from "../layouts/AuthLayout";
import AuthButton from "../components/AuthButton";
import LoadingDots from "../components/LoadingDots";

function LoginPage() {
  const { errorMessage, isLoading, signIn } = useGitHubSignIn();

  return (
    <AuthLayout
      label="admin_access"
      title="Panel administratora"
      description="Zaloguj się kontem GitHub, aby zarządzać treścią portfolio."
    >
      <AuthButton
        type="button"
        onClick={() => void signIn()}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            Logowanie
            <LoadingDots />
          </>
        ) : (
          "Zaloguj przez GitHub"
        )}
      </AuthButton>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </AuthLayout>
  );
}

export default LoginPage;
