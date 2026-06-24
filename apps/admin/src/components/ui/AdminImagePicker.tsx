import { useId } from "react";

import AdminField from "./AdminField";
import AdminFilePickerMessages from "./AdminFilePickerMessages";
import AdminImagePreview from "./AdminImagePreview";
import AdminImagePreviewRemoveButton from "./AdminImagePreviewRemoveButton";
import AdminImagePreviewSelectButton from "./AdminImagePreviewSelectButton";
import AdminImagePreviewSelectCorner from "./AdminImagePreviewSelectCorner";
import { useAdminImagePicker } from "@admin/hooks/useAdminImagePicker";
import { WEBP_IMAGE_ACCEPT } from "@shared/utils/webpImage";

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

type AdminImagePickerControlsProps = {
  selectedFile?: File | null;
  imageMarkedForRemoval: boolean;
  disabled: boolean;
  openPicker: () => void;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange?: (marked: boolean) => void;
};

function AdminImagePickerControls({
  selectedFile,
  imageMarkedForRemoval,
  disabled,
  openPicker,
  onFileSelect,
  onImageMarkedForRemovalChange,
}: AdminImagePickerControlsProps) {
  return (
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

      <AdminImagePreviewSelectButton disabled={disabled} onClick={openPicker} />
    </AdminImagePreviewSelectCorner>
  );
}

type AdminImagePickerMessagesProps = {
  fileError?: string;
  selectedFile?: File | null;
  selectedFileHint?: string;
  isAnimatedWebp: boolean | null;
  imageMarkedForRemoval: boolean;
};

function AdminImagePickerMessages({
  fileError,
  selectedFile,
  selectedFileHint,
  isAnimatedWebp,
  imageMarkedForRemoval,
}: AdminImagePickerMessagesProps) {
  return (
    <AdminFilePickerMessages
      fileError={fileError}
      selectedFileName={selectedFile?.name}
      selectedFileHint={
        selectedFileHint ? (
          <span
            className={
              isAnimatedWebp ? "text-emerald-300/90" : "text-amber-300/90"
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
  );
}

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
  const {
    previewUrl,
    canRemoveImage,
    fileError,
    handleInputChange,
    inputRef,
    openPicker,
    isAnimatedWebp,
    selectedFileHint,
  } = useAdminImagePicker({
    imageUrl,
    selectedFile,
    imageMarkedForRemoval,
    onFileSelect,
    onImageMarkedForRemovalChange,
  });

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
            onClick={() => onImageMarkedForRemovalChange?.(true)}
          />
        ) : null}

        <input
          ref={inputRef}
          id={fieldId}
          type="file"
          accept={WEBP_IMAGE_ACCEPT}
          disabled={disabled}
          className="sr-only"
          onChange={handleInputChange}
        />

        <AdminImagePickerControls
          selectedFile={selectedFile}
          imageMarkedForRemoval={imageMarkedForRemoval}
          disabled={disabled}
          openPicker={openPicker}
          onFileSelect={onFileSelect}
          onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
        />
      </AdminImagePreview>

      <AdminImagePickerMessages
        fileError={fileError}
        selectedFile={selectedFile}
        selectedFileHint={selectedFileHint}
        isAnimatedWebp={isAnimatedWebp}
        imageMarkedForRemoval={imageMarkedForRemoval}
      />
    </AdminField>
  );
}

export default AdminImagePicker;
