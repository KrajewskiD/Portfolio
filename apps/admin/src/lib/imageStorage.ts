import { supabase } from "@admin/lib/supabase";
import {
  PROFILE_IMAGE_STORAGE_PATH,
  PROFILE_IMAGES_BUCKET,
  PROJECT_IMAGES_BUCKET,
  PROJECT_MINIATURES_BUCKET,
  PROJECT_VIDEOS_BUCKET,
  appendCacheBust,
  assertValidProfileImagePath,
  createBucketUrlResolver,
  getProjectMiniatureStoragePath,
  resolveStorageImageUrl,
} from "@shared/database";
import {
  validateWebpImageFile,
  WEBP_IMAGE_ACCEPT,
} from "@shared/utils/webpImage";
import {
  getProjectVideoExtension,
  validateProjectVideoFile,
} from "@shared/utils/videoFile";

const getProfileImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROFILE_IMAGES_BUCKET,
);
const getProjectImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_IMAGES_BUCKET,
);
const getProjectVideoPublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_VIDEOS_BUCKET,
);
const getProjectMiniaturePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_MINIATURES_BUCKET,
);

export {
  getProfileImagePublicUrl,
  getProjectImagePublicUrl,
  getProjectMiniaturePublicUrl,
  getProjectVideoPublicUrl,
};

const STORAGE_UPLOAD_CACHE_CONTROL = "60";

async function getVersionedStorageUrl(
  bucket: string,
  path: string,
  getPublicUrl: (path: string) => string,
  forceVersion: number,
): Promise<string> {
  const versionedUrl = await resolveStorageImageUrl(
    supabase,
    bucket,
    path,
    getPublicUrl,
    { forceVersion },
  );

  return (
    versionedUrl ?? appendCacheBust(getPublicUrl(path), forceVersion)
  );
}

export async function getVersionedProfileImageUrl(path: string): Promise<string> {
  return getVersionedStorageUrl(
    PROFILE_IMAGES_BUCKET,
    path,
    getProfileImagePublicUrl,
    Date.now(),
  );
}

export async function getVersionedProjectMiniatureUrl(
  path: string,
): Promise<string> {
  return getVersionedStorageUrl(
    PROJECT_MINIATURES_BUCKET,
    path,
    getProjectMiniaturePublicUrl,
    Date.now(),
  );
}

export async function getVersionedProjectImageUrl(path: string): Promise<string> {
  return getVersionedStorageUrl(
    PROJECT_IMAGES_BUCKET,
    path,
    getProjectImagePublicUrl,
    Date.now(),
  );
}

function assertBucket(bucket: string, expectedBucket: string): void {
  if (bucket !== expectedBucket) {
    throw new Error(
      `Błędna konfiguracja storage: oczekiwano "${expectedBucket}", otrzymano "${bucket}".`,
    );
  }
}

async function assertWebpImageFile(file: File): Promise<void> {
  const validation = await validateWebpImageFile(file);

  if (!validation.valid) {
    throw new Error(validation.message);
  }
}

export async function uploadProfileImage(file: File): Promise<string> {
  await assertWebpImageFile(file);
  assertBucket(PROFILE_IMAGES_BUCKET, "profile-images");

  const path = PROFILE_IMAGE_STORAGE_PATH;

  const { error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: WEBP_IMAGE_ACCEPT,
      cacheControl: STORAGE_UPLOAD_CACHE_CONTROL,
    });

  if (error) {
    throw new Error(
      `Nie udało się zapisać zdjęcia profilowego w buckecie "${PROFILE_IMAGES_BUCKET}": ${error.message}`,
    );
  }

  assertValidProfileImagePath(path);
  return path;
}

export async function uploadProjectTopicImage(
  projectId: string,
  topicId: string,
  file: File,
): Promise<string> {
  await assertWebpImageFile(file);
  assertBucket(PROJECT_IMAGES_BUCKET, "project-images");

  const path = `${projectId}/${topicId}.webp`;

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: WEBP_IMAGE_ACCEPT,
      cacheControl: STORAGE_UPLOAD_CACHE_CONTROL,
    });

  if (error) {
    throw error;
  }

  return path;
}

export async function uploadProjectMiniature(
  projectId: string,
  file: File,
): Promise<string> {
  await assertWebpImageFile(file);
  assertBucket(PROJECT_MINIATURES_BUCKET, "project-miniatures");

  const path = getProjectMiniatureStoragePath(projectId);

  const { error } = await supabase.storage
    .from(PROJECT_MINIATURES_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: WEBP_IMAGE_ACCEPT,
      cacheControl: STORAGE_UPLOAD_CACHE_CONTROL,
    });

  if (error) {
    throw new Error(
      `Nie udało się zapisać miniatury w buckecie "${PROJECT_MINIATURES_BUCKET}": ${error.message}`,
    );
  }

  return path;
}

export async function deleteProfileImage(path: string): Promise<void> {
  assertValidProfileImagePath(path);

  const { error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

export async function deleteProjectTopicImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

export async function deleteProjectMiniature(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(PROJECT_MINIATURES_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

export async function uploadProjectVideo(
  projectId: string,
  file: File,
): Promise<string> {
  const validation = await validateProjectVideoFile(file);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const extension = getProjectVideoExtension(file);
  const path = `${projectId}/showcase.${extension}`;
  const contentType = extension === "webm" ? "video/webm" : "video/mp4";

  const { error } = await supabase.storage
    .from(PROJECT_VIDEOS_BUCKET)
    .upload(path, file, { upsert: true, contentType });

  if (error) {
    throw error;
  }

  return path;
}

export async function deleteProjectVideo(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(PROJECT_VIDEOS_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

export async function deleteProjectVideos(projectId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(PROJECT_VIDEOS_BUCKET)
    .list(projectId);

  if (listError) {
    throw listError;
  }

  if (!files?.length) {
    return;
  }

  const paths = files.map((file) => `${projectId}/${file.name}`);
  const { error: removeError } = await supabase.storage
    .from(PROJECT_VIDEOS_BUCKET)
    .remove(paths);

  if (removeError) {
    throw removeError;
  }
}

export async function deleteProjectMiniatures(projectId: string): Promise<void> {
  const paths = [
    getProjectMiniatureStoragePath(projectId),
    `${projectId}.webp`,
  ];

  const { error } = await supabase.storage
    .from(PROJECT_MINIATURES_BUCKET)
    .remove(paths);

  if (error) {
    throw error;
  }
}

export async function deleteProjectImages(projectId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .list(projectId);

  if (listError) {
    throw listError;
  }

  if (!files?.length) {
    return;
  }

  const paths = files.map((file) => `${projectId}/${file.name}`);
  const { error: removeError } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .remove(paths);

  if (removeError) {
    throw removeError;
  }
}
