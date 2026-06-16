import { useEffect, useId, useMemo, useRef } from "react";

import AdminButton from "./AdminButton";
import AdminField from "./AdminField";

type AdminImagePickerProps = {
  label: string;
  imageUrl?: string;
  selectedFile?: File | null;
  previewAlt: string;
  emptyLabel: string;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
};

function AdminImagePicker({
  label,
  imageUrl,
  selectedFile,
  previewAlt,
  emptyLabel,
  disabled = false,
  onFileSelect,
}: AdminImagePickerProps) {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const localPreviewUrl = useMemo(() => {
    if (!selectedFile) {
      return undefined;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (!localPreviewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const previewUrl = localPreviewUrl ?? imageUrl;

  return (
    <AdminField id={fieldId} label={label}>
      <div className="admin-image-preview">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={previewAlt}
            className="admin-image-preview__image"
          />
        ) : (
          <span className="px-6 text-white/40">{emptyLabel}</span>
        )}

        <input
          ref={inputRef}
          id={fieldId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onFileSelect(file);
            event.target.value = "";
          }}
        />

        <div className="admin-image-preview__actions">
          {selectedFile ? (
            <AdminButton
              type="button"
              variant="ghost"
              disabled={disabled}
              className="admin-image-preview__action"
              onClick={() => onFileSelect(null)}
            >
              Anuluj
            </AdminButton>
          ) : null}

          <AdminButton
            type="button"
            variant="secondary"
            disabled={disabled}
            className="admin-image-preview__action"
            onClick={() => inputRef.current?.click()}
          >
            Wybierz zdjęcie
          </AdminButton>
        </div>
      </div>

      {selectedFile ? (
        <p className="text-center text-sm text-white/50">
          Wybrany plik: {selectedFile.name} (zapisze się po kliknięciu „Zapisz”)
        </p>
      ) : null}
    </AdminField>
  );
}

export default AdminImagePicker;
