import AdminButton from "./AdminButton";

type AdminAddButtonProps = {
  label: string;
  onClick?: () => void;
};

function AdminAddButton({ label, onClick }: AdminAddButtonProps) {
  return (
    <AdminButton
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="px-5 py-2 text-xl font-black"
    >
      +
    </AdminButton>
  );
}

export default AdminAddButton;
