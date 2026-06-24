export const WEBP_IMAGE_ACCEPT = "image/webp";

export type WebpImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };

const INVALID_PREFIX_EXTENSION_PATTERN =
  /\.(png|jpe?g|gif|bmp|svg|avif|heic|heif)\.webp$/i;

function readAsciiChunk(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end));
}

function hasWebpSignature(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 12) {
    return false;
  }

  const bytes = new Uint8Array(buffer);

  return (
    readAsciiChunk(bytes, 0, 4) === "RIFF" &&
    readAsciiChunk(bytes, 8, 12) === "WEBP"
  );
}

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

  if (!hasWebpSignature(buffer)) {
    return {
      valid: false,
      message: "Plik nie jest prawidłowym obrazem WebP.",
    };
  }

  return { valid: true };
}

export async function isAnimatedWebpFile(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 64).arrayBuffer();

  if (buffer.byteLength < 21) {
    return false;
  }

  if (!hasWebpSignature(buffer)) {
    return false;
  }

  const bytes = new Uint8Array(buffer);
  const chunkType = String.fromCharCode(
    bytes[12],
    bytes[13],
    bytes[14],
    bytes[15],
  );

  if (chunkType === "VP8X") {
    return (bytes[20] & 0x02) !== 0;
  }

  const chunkText = new TextDecoder().decode(bytes.slice(12, 64));
  return chunkText.includes("ANIM") || chunkText.includes("ANMF");
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
