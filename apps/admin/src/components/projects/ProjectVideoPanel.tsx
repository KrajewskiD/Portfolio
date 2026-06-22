import { useId, useRef, useState } from "react";

import AdminField from "@admin/components/ui/AdminField";
import AdminButton from "@admin/components/ui/AdminButton";
import AdminFilePickerMessages from "@admin/components/ui/AdminFilePickerMessages";
import { useLocalFilePreview } from "@admin/hooks/useLocalFilePreview";
import {
  PROJECT_VIDEO_ACCEPT,
  validateProjectVideoFile,
} from "@shared/utils/videoFile";

type ProjectVideoPanelProps = {
  videoUrl?: string;
  selectedFile?: File | null;
  videoMarkedForRemoval?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onVideoMarkedForRemovalChange?: (marked: boolean) => void;
};

function ProjectVideoPanel({
  videoUrl,
  selectedFile,
  videoMarkedForRemoval = false,
  disabled = false,
  onFileSelect,
  onVideoMarkedForRemovalChange,
}: ProjectVideoPanelProps) {
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>();
  const localPreviewUrl = useLocalFilePreview(selectedFile);

  const previewUrl = videoMarkedForRemoval
    ? undefined
    : (localPreviewUrl ?? videoUrl);

  async function handleFileChange(file: File | null) {
    if (!file) {
      setFileError(undefined);
      onFileSelect(null);
      return;
    }

    const validation = await validateProjectVideoFile(file);

    if (!validation.valid) {
      setFileError(validation.message);
      onFileSelect(null);
      return;
    }

    setFileError(undefined);
    onVideoMarkedForRemovalChange?.(false);
    onFileSelect(file);
  }

  return (
    <AdminField
      id={fieldId}
      label="Wideo prezentacji"
      hint="Krótkie wideo projektu w pętli (MP4 lub WebM). Wyświetlane w karuzeli pod sekcją O mnie."
    >
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
          {previewUrl ? (
            <video
              key={previewUrl}
              src={previewUrl}
              className="aspect-video w-full bg-black object-cover"
              controls
              muted
              loop
              playsInline
            />
          ) : (
            <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-subtle">
              Brak wideo prezentacji
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <AdminButton
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {previewUrl ? "Zmień wideo" : "Dodaj wideo"}
          </AdminButton>

          {previewUrl ? (
            <AdminButton
              type="button"
              variant="ghost"
              disabled={disabled}
              onClick={() => {
                void handleFileChange(null);
                onVideoMarkedForRemovalChange?.(true);

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              Usuń wideo
            </AdminButton>
          ) : null}
        </div>

        <input
          ref={inputRef}
          id={fieldId}
          type="file"
          accept={PROJECT_VIDEO_ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            event.target.value = "";
            void handleFileChange(file);
          }}
        />

        <AdminFilePickerMessages
          fileError={fileError}
          selectedFileName={selectedFile?.name}
          markedForRemovalMessage={
            videoMarkedForRemoval
              ? "Wideo zostanie usunięte po kliknięciu „Zapisz”."
              : undefined
          }
        />
      </div>
    </AdminField>
  );
}

export default ProjectVideoPanel;
