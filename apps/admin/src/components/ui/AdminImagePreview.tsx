import { useEffect, useState, type ReactNode } from "react";

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
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && !hasLoadError;

  return (
    <div className="admin-image-preview">
      {showImage ? (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={previewAlt}
          className="admin-image-preview__image"
          onError={() => setHasLoadError(true)}
        />
      ) : (
        <span className="px-6 text-white/40">{emptyLabel}</span>
      )}

      {children}
    </div>
  );
}

export default AdminImagePreview;
