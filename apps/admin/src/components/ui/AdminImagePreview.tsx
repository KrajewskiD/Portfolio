import { useState, type ReactNode } from "react";

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
  const [failedImageUrl, setFailedImageUrl] = useState<string>();

  const showImage = Boolean(imageUrl) && imageUrl !== failedImageUrl;

  return (
    <div className="admin-image-preview">
      {showImage ? (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={previewAlt}
          className="admin-image-preview__image"
          onError={() => setFailedImageUrl(imageUrl)}
        />
      ) : (
        <span className="px-6 text-white/40">{emptyLabel}</span>
      )}

      {children}
    </div>
  );
}

export default AdminImagePreview;
