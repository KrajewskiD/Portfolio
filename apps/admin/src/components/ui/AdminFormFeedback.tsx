type AdminFormFeedbackProps = {
  loadError?: string;
  saveError?: string;
  saveSuccess?: boolean;
  extraErrors?: string[];
};

function AdminFormFeedback({
  loadError,
  saveError,
  saveSuccess,
  extraErrors = [],
}: AdminFormFeedbackProps) {
  return (
    <>
      {extraErrors.map((error) => (
        <p key={error} role="alert" className="admin-alert-error">
          {error}
        </p>
      ))}

      {loadError ? (
        <p role="status" className="admin-alert-warning">
          {loadError}
        </p>
      ) : null}

      {saveError ? (
        <p role="alert" className="admin-alert-error">
          {saveError}
        </p>
      ) : null}

      {saveSuccess ? (
        <p role="status" className="admin-alert-success">
          Zmiany zostały zapisane.
        </p>
      ) : null}
    </>
  );
}

export default AdminFormFeedback;
