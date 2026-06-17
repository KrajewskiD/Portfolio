import AdminButton from "./AdminButton";

type AdminAddButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

function AdminAddButton({
  label,
  onClick,
  disabled = false,
}: AdminAddButtonProps) {
  return (
    <AdminButton
      type="button"
      variant="success"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="admin-icon-button"
    >
      +
    </AdminButton>
  );
}

export default AdminAddButton;
