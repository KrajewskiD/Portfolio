import AuthLayout from "@admin/layouts/AuthLayout";
import AdminButton from "@admin/components/ui/AdminButton";

function AuthErrorPage() {
  return (
    <AuthLayout
      label="Błąd autoryzacji"
      title="Nie udało się sprawdzić uprawnień"
      description="Sprawdź połączenie i spróbuj ponownie."
    >
      <AdminButton type="button" onClick={() => window.location.reload()}>
        Spróbuj ponownie
      </AdminButton>
    </AuthLayout>
  );
}

export default AuthErrorPage;
