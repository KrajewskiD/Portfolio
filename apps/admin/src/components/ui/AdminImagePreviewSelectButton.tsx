import AdminButton from "./AdminButton";

type AdminImagePreviewSelectButtonProps = {
  label?: string;
  disabled?: boolean;
  variant?: "secondary" | "ghost";
  onClick: () => void;
};

function AdminImagePreviewSelectButton({
  label = "Wybierz zdjęcie",
  disabled = false,
  variant = "secondary",
  onClick,
}: AdminImagePreviewSelectButtonProps) {
  return (
    <AdminButton
      type="button"
      variant={variant}
      disabled={disabled}
      className="admin-image-preview__corner-action admin-image-preview__corner-action--button"
      onClick={onClick}
    >
      {label}
    </AdminButton>
  );
}

export default AdminImagePreviewSelectButton;
