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
        <p key={error} role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ))}

      {loadError ? (
        <p role="status" className="text-sm text-amber-300">
          {loadError}
        </p>
      ) : null}

      {saveError ? (
        <p role="alert" className="text-sm text-red-300">
          {saveError}
        </p>
      ) : null}

      {saveSuccess ? (
        <p role="status" className="text-sm text-emerald-300">
          Zmiany zostały zapisane.
        </p>
      ) : null}
    </>
  );
}

export default AdminFormFeedback;
