import type { ReactNode } from "react";

type AdminImagePreviewProps = {
  imageUrl?: string;
  previewAlt: string;
  emptyLabel: string;
  children?: ReactNode;
};

function AdminImagePreview({
  imageUrl,
  previewAlt,
  emptyLabel,
  children,
}: AdminImagePreviewProps) {
  return (
    <div className="admin-image-preview">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={previewAlt}
          className="admin-image-preview__image"
        />
      ) : (
        <span className="px-6 text-white/40">{emptyLabel}</span>
      )}

      {children}
    </div>
  );
}

export default AdminImagePreview;
