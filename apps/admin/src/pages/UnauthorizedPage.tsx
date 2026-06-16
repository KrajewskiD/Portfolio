import AuthLayout from "../layouts/AuthLayout";

function UnauthorizedPage() {
  return (
    <AuthLayout
      label="401"
      title="Unauthorized"
      description="Nie masz dostępu do tej części panelu administratora."
    />
  );
}

export default UnauthorizedPage;
