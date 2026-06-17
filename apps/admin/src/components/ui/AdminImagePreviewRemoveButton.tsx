import trashIcon from "@shared/assets/icons/trash.svg";

import AdminImagePreviewCorner from "./AdminImagePreviewCorner";

type AdminImagePreviewRemoveButtonProps = {
  label?: string;
  disabled?: boolean;
  onClick: () => void;
};

function AdminImagePreviewRemoveButton({
  label = "Usuń zdjęcie",
  disabled = false,
  onClick,
}: AdminImagePreviewRemoveButtonProps) {
  return (
    <AdminImagePreviewCorner position="top-left">
      <button
        type="button"
        className="admin-image-preview__corner-action admin-image-preview__corner-action--icon"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
      >
        <img
          src={trashIcon}
          alt=""
          aria-hidden
          className="h-4 w-4 brightness-0 invert"
        />
      </button>
    </AdminImagePreviewCorner>
  );
}

export default AdminImagePreviewRemoveButton;
