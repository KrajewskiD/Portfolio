import AdminButton from "./AdminButton";

type AdminSaveButtonProps = {
  disabled?: boolean;
  isSaving?: boolean;
  onSave: () => void | Promise<unknown>;
};

function AdminSaveButton({
  disabled = false,
  isSaving = false,
  onSave,
}: AdminSaveButtonProps) {
  return (
    <AdminButton
      type="button"
      variant="secondary"
      disabled={disabled}
      onClick={() => void onSave()}
    >
      {isSaving ? "Zapisywanie..." : "Zapisz"}
    </AdminButton>
  );
}

export default AdminSaveButton;
