import { useEffect, useId, useMemo, useRef, useState } from "react";

import AdminField from "./AdminField";
import AdminImagePreview from "./AdminImagePreview";
import AdminImagePreviewRemoveButton from "./AdminImagePreviewRemoveButton";
import AdminImagePreviewSelectButton from "./AdminImagePreviewSelectButton";
import AdminImagePreviewSelectCorner from "./AdminImagePreviewSelectCorner";
import {
  validateWebpImageFile,
  WEBP_IMAGE_ACCEPT,
} from "@shared/utils/webpImage";

type AdminImagePickerProps = {
  label: string;
  imageUrl?: string;
  selectedFile?: File | null;
  imageMarkedForRemoval?: boolean;
  previewAlt: string;
  emptyLabel: string;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange?: (marked: boolean) => void;
};

function AdminImagePicker({
  label,
  imageUrl,
  selectedFile,
  imageMarkedForRemoval = false,
  previewAlt,
  emptyLabel,
  disabled = false,
  onFileSelect,
  onImageMarkedForRemovalChange,
}: AdminImagePickerProps) {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>();
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

  const previewUrl = imageMarkedForRemoval
    ? undefined
    : (localPreviewUrl ?? imageUrl);

  const canRemoveImage =
    Boolean(imageUrl) &&
    !selectedFile &&
    !imageMarkedForRemoval &&
    onImageMarkedForRemovalChange;

  return (
    <AdminField id={fieldId} label={label}>
      <AdminImagePreview
        imageUrl={previewUrl}
        previewAlt={previewAlt}
        emptyLabel={emptyLabel}
      >
        {canRemoveImage ? (
          <AdminImagePreviewRemoveButton
            disabled={disabled}
            onClick={() => onImageMarkedForRemovalChange(true)}
          />
        ) : null}

        <input
          ref={inputRef}
          id={fieldId}
          type="file"
          accept={WEBP_IMAGE_ACCEPT}
          disabled={disabled}
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0] ?? null;
            event.target.value = "";

            if (!file) {
              return;
            }

            const validation = await validateWebpImageFile(file);

            if (!validation.valid) {
              setFileError(validation.message);
              return;
            }

            setFileError(undefined);
            onFileSelect(file);
          }}
        />

        <AdminImagePreviewSelectCorner>
          {selectedFile ? (
            <AdminImagePreviewSelectButton
              label="Anuluj"
              variant="ghost"
              disabled={disabled}
              onClick={() => onFileSelect(null)}
            />
          ) : null}

          {imageMarkedForRemoval && onImageMarkedForRemovalChange ? (
            <AdminImagePreviewSelectButton
              label="Cofnij"
              variant="ghost"
              disabled={disabled}
              onClick={() => onImageMarkedForRemovalChange(false)}
            />
          ) : null}

          <AdminImagePreviewSelectButton
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          />
        </AdminImagePreviewSelectCorner>
      </AdminImagePreview>

      {fileError ? (
        <p role="alert" className="text-center text-sm text-red-300">
          {fileError}
        </p>
      ) : null}

      {selectedFile ? (
        <p className="text-center text-sm text-white/50">
          Wybrany plik: {selectedFile.name} (zapisze się po kliknięciu „Zapisz”)
        </p>
      ) : null}

      {imageMarkedForRemoval ? (
        <p className="text-center text-sm text-amber-300/80">
          Zdjęcie zostanie usunięte po kliknięciu „Zapisz”.
        </p>
      ) : null}
    </AdminField>
  );
}

export default AdminImagePicker;
