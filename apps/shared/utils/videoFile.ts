export const PROJECT_VIDEO_ACCEPT = "video/mp4,video/webm";

export type VideoFileValidationResult =
  | { valid: true }
  | { valid: false; message: string };

const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm"] as const;

export function validateProjectVideoFileName(
  fileName: string,
): VideoFileValidationResult {
  const normalized = fileName.trim().toLowerCase();
  const hasAllowedExtension = ALLOWED_VIDEO_EXTENSIONS.some((extension) =>
    normalized.endsWith(extension),
  );

  if (!hasAllowedExtension) {
    return {
      valid: false,
      message: "Plik musi mieć rozszerzenie .mp4 lub .webm.",
    };
  }

  return { valid: true };
}

export async function validateProjectVideoFile(
  file: File,
): Promise<VideoFileValidationResult> {
  const fileNameValidation = validateProjectVideoFileName(file.name);

  if (!fileNameValidation.valid) {
    return fileNameValidation;
  }

  if (file.type !== "video/mp4" && file.type !== "video/webm") {
    return {
      valid: false,
      message: "Dozwolone są tylko pliki wideo MP4 lub WebM.",
    };
  }

  return { valid: true };
}

export function getProjectVideoExtension(file: File): "mp4" | "webm" {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "webm") {
    return "webm";
  }

  return "mp4";
}
