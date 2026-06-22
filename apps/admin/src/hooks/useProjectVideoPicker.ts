import { useLocalFilePreview } from "@admin/hooks/useLocalFilePreview";
import { useValidatedFilePicker } from "@admin/hooks/useValidatedFilePicker";
import { validateProjectVideoFile } from "@shared/utils/videoFile";

type UseProjectVideoPickerParams = {
  videoUrl?: string;
  selectedFile?: File | null;
  videoMarkedForRemoval?: boolean;
  onFileSelect: (file: File | null) => void;
  onVideoMarkedForRemovalChange?: (marked: boolean) => void;
};

export function useProjectVideoPicker({
  videoUrl,
  selectedFile,
  videoMarkedForRemoval = false,
  onFileSelect,
  onVideoMarkedForRemovalChange,
}: UseProjectVideoPickerParams) {
  const localPreviewUrl = useLocalFilePreview(selectedFile);
  const {
    clearSelection,
    fileError,
    handleInputChange,
    inputRef,
    openPicker,
  } = useValidatedFilePicker({
    validate: validateProjectVideoFile,
    onValidFile: (file) => {
      onVideoMarkedForRemovalChange?.(false);
      onFileSelect(file);
    },
    onClear: () => onFileSelect(null),
  });

  const previewUrl = videoMarkedForRemoval
    ? undefined
    : (localPreviewUrl ?? videoUrl);

  const removeVideo = () => {
    clearSelection();
    onVideoMarkedForRemovalChange?.(true);
  };

  return {
    previewUrl,
    fileError,
    handleInputChange,
    inputRef,
    openPicker,
    removeVideo,
  };
}
