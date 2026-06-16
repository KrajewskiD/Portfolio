import AdminButton from "./AdminButton";

type AdminDeleteButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

function AdminDeleteButton({
  label,
  onClick,
  disabled = false,
}: AdminDeleteButtonProps) {
  return (
    <AdminButton
      type="button"
      variant="danger"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="px-4 py-2 text-sm"
    >
      Usuń
    </AdminButton>
  );
}

export default AdminDeleteButton;
