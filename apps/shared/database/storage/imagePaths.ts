export const PROFILE_IMAGE_STORAGE_PATH = "profile/avatar.webp";
export const LEGACY_PROFILE_IMAGE_STORAGE_PATH = "profile.webp";

const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
const PROFILE_IMAGE_PATH_PATTERN = new RegExp(
  `^profile/avatar(?:-${UUID_PATTERN})?\\.webp$`,
  "i",
);
const PROJECT_MINIATURE_PATH_PATTERN = new RegExp(
  `^${UUID_PATTERN}(?:\\.webp|/miniature(?:-${UUID_PATTERN})?\\.webp)$`,
  "i",
);

export function getProfileImageStoragePath(imageId: string): string {
  return `profile/avatar-${imageId}.webp`;
}

export function getProjectMiniatureStoragePath(
  projectId: string,
  imageId?: string,
): string {
  return imageId
    ? `${projectId}/miniature-${imageId}.webp`
    : `${projectId}/miniature.webp`;
}

export function isProjectMiniatureStoragePath(path: string): boolean {
  return PROJECT_MINIATURE_PATH_PATTERN.test(path);
}

export function isProfileImageStoragePath(path: string): boolean {
  return (
    PROFILE_IMAGE_PATH_PATTERN.test(path) ||
    path === PROFILE_IMAGE_STORAGE_PATH ||
    path === LEGACY_PROFILE_IMAGE_STORAGE_PATH
  );
}

export function assertValidProfileImagePath(path: string): void {
  if (isProjectMiniatureStoragePath(path)) {
    throw new Error(
      "W profilu zapisano ścieżkę miniatury projektu. Wybierz zdjęcie profilowe ponownie i zapisz profil.",
    );
  }

  if (!isProfileImageStoragePath(path)) {
    throw new Error(`Nieobsługiwana ścieżka zdjęcia profilowego: ${path}`);
  }
}

export function normalizeProfileImagePath(
  path: string | null | undefined,
): string | undefined {
  if (!path) {
    return undefined;
  }

  if (isProjectMiniatureStoragePath(path)) {
    return undefined;
  }

  return path;
}
