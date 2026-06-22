import { useEffect, useId, useRef, useState } from "react";

import AdminField from "./AdminField";
import AdminFilePickerMessages from "./AdminFilePickerMessages";
import AdminImagePreview from "./AdminImagePreview";
import AdminImagePreviewRemoveButton from "./AdminImagePreviewRemoveButton";
import AdminImagePreviewSelectButton from "./AdminImagePreviewSelectButton";
import AdminImagePreviewSelectCorner from "./AdminImagePreviewSelectCorner";
import { useLocalFilePreview } from "@admin/hooks/useLocalFilePreview";
import {
  isAnimatedWebpFile,
  validateWebpImageFile,
  WEBP_IMAGE_ACCEPT,
} from "@shared/utils/webpImage";

type AdminImagePickerProps = {
  label: string;
  hint?: string;
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
  hint,
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
  const [animatedWebpCheck, setAnimatedWebpCheck] = useState<{
    file: File;
    isAnimated: boolean;
  } | null>(null);
  const localPreviewUrl = useLocalFilePreview(selectedFile);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    let isCancelled = false;

    void isAnimatedWebpFile(selectedFile).then((isAnimated) => {
      if (!isCancelled) {
        setAnimatedWebpCheck({ file: selectedFile, isAnimated });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedFile]);

  const previewUrl = imageMarkedForRemoval
    ? undefined
    : (localPreviewUrl ?? imageUrl);

  const canRemoveImage =
    Boolean(imageUrl) &&
    !selectedFile &&
    !imageMarkedForRemoval &&
    onImageMarkedForRemovalChange;

  const isAnimatedWebp =
    selectedFile && animatedWebpCheck?.file === selectedFile
      ? animatedWebpCheck.isAnimated
      : null;

  const selectedFileHint =
    isAnimatedWebp === true
      ? "Wykryto animowany WebP — na stronie odtworzy się w przeglądarce."
      : isAnimatedWebp === false
        ? "To jest statyczny WebP (bez animacji). Jeśli oczekujesz ruchu, wyeksportuj ponownie jako animated WebP albo użyj WebM."
        : undefined;

  return (
    <AdminField id={fieldId} label={label} hint={hint}>
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

      <AdminFilePickerMessages
        fileError={fileError}
        selectedFileName={selectedFile?.name}
        selectedFileHint={
          selectedFileHint ? (
            <span
              className={
                isAnimatedWebp
                  ? "text-emerald-300/90"
                  : "text-amber-300/90"
              }
            >
              {selectedFileHint}
            </span>
          ) : undefined
        }
        markedForRemovalMessage={
          imageMarkedForRemoval
            ? "Zdjęcie zostanie usunięte po kliknięciu „Zapisz”."
            : undefined
        }
      />
    </AdminField>
  );
}

export default AdminImagePicker;
