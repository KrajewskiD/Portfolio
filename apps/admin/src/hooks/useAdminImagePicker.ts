import { useLocalFilePreview } from "@admin/hooks/useLocalFilePreview";
import { useValidatedFilePicker } from "@admin/hooks/useValidatedFilePicker";
import { useAnimatedWebpCheck } from "@admin/hooks/useAnimatedWebpCheck";
import { validateWebpImageFile } from "@shared/utils/webpImage";

type UseAdminImagePickerParams = {
  imageUrl?: string;
  selectedFile?: File | null;
  imageMarkedForRemoval?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange?: (marked: boolean) => void;
};

export function useAdminImagePicker({
  imageUrl,
  selectedFile,
  imageMarkedForRemoval = false,
  onFileSelect,
  onImageMarkedForRemovalChange,
}: UseAdminImagePickerParams) {
  const localPreviewUrl = useLocalFilePreview(selectedFile);
  const { fileError, handleInputChange, inputRef, openPicker } =
    useValidatedFilePicker({
      validate: validateWebpImageFile,
      onValidFile: onFileSelect,
      onClear: () => onFileSelect(null),
    });

  const { isAnimatedWebp, selectedFileHint } =
    useAnimatedWebpCheck(selectedFile);

  const previewUrl = imageMarkedForRemoval
    ? undefined
    : (localPreviewUrl ?? imageUrl);

  const canRemoveImage =
    Boolean(imageUrl) &&
    !selectedFile &&
    !imageMarkedForRemoval &&
    Boolean(onImageMarkedForRemovalChange);

  return {
    previewUrl,
    canRemoveImage,
    fileError,
    handleInputChange,
    inputRef,
    openPicker,
    isAnimatedWebp,
    selectedFileHint,
  };
}
