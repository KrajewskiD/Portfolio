export const WEBP_IMAGE_ACCEPT = "image/webp";

export type WebpImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };

const INVALID_PREFIX_EXTENSION_PATTERN =
  /\.(png|jpe?g|gif|bmp|svg|avif|heic|heif)\.webp$/i;

export function validateWebpImageFileName(
  fileName: string,
): WebpImageValidationResult {
  const normalized = fileName.trim();

  if (!normalized.toLowerCase().endsWith(".webp")) {
    return {
      valid: false,
      message: "Plik musi mieć rozszerzenie .webp.",
    };
  }

  if (INVALID_PREFIX_EXTENSION_PATTERN.test(normalized)) {
    return {
      valid: false,
      message: "Nieprawidłowa nazwa pliku. Użyj samego rozszerzenia .webp.",
    };
  }

  return { valid: true };
}

export function validateWebpImageMimeType(
  mimeType: string,
): WebpImageValidationResult {
  if (mimeType !== WEBP_IMAGE_ACCEPT) {
    return {
      valid: false,
      message: "Dozwolony jest wyłącznie format WebP.",
    };
  }

  return { valid: true };
}

export async function validateWebpImageSignature(
  file: File,
): Promise<WebpImageValidationResult> {
  const buffer = await file.slice(0, 12).arrayBuffer();

  if (buffer.byteLength < 12) {
    return {
      valid: false,
      message: "Plik jest uszkodzony lub za krótki.",
    };
  }

  const bytes = new Uint8Array(buffer);
  const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  const format = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);

  if (header !== "RIFF" || format !== "WEBP") {
    return {
      valid: false,
      message: "Plik nie jest prawidłowym obrazem WebP.",
    };
  }

  return { valid: true };
}

export async function validateWebpImageFile(
  file: File,
): Promise<WebpImageValidationResult> {
  const fileNameResult = validateWebpImageFileName(file.name);

  if (!fileNameResult.valid) {
    return fileNameResult;
  }

  const mimeTypeResult = validateWebpImageMimeType(file.type);

  if (!mimeTypeResult.valid) {
    return mimeTypeResult;
  }

  return validateWebpImageSignature(file);
}
