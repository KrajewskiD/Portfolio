import { supabase } from "@admin/lib/supabase";
import { createStorageOperations } from "@admin/lib/storageOperations";
import {
  PROJECT_IMAGES_BUCKET,
  PROJECT_MINIATURES_BUCKET,
  createBucketUrlResolver,
  getProjectMiniatureStoragePath,
} from "@shared/database";
import { WEBP_IMAGE_ACCEPT } from "@shared/utils/webpImage";

import { STORAGE_UPLOAD_CACHE_CONTROL } from "./storageConstants";
import { assertBucket, assertWebpImageFile } from "./storageValidation";
import { getVersionedStorageUrl } from "./storageUrl";

const { deleteStorageFiles, deleteStorageFolder, uploadStorageFile } =
  createStorageOperations(supabase);

export const getProjectImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_IMAGES_BUCKET,
);

export const getProjectMiniaturePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_MINIATURES_BUCKET,
);

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

export async function getVersionedProjectImageUrl(
  path: string,
): Promise<string> {
  return getVersionedStorageUrl(
    PROJECT_IMAGES_BUCKET,
    path,
    getProjectImagePublicUrl,
    Date.now(),
  );
}

export async function uploadProjectTopicImage(
  projectId: string,
  topicId: string,
  file: File,
): Promise<string> {
  await assertWebpImageFile(file);
  assertBucket(PROJECT_IMAGES_BUCKET, "project-images");

  const path = `${projectId}/${topicId}-${crypto.randomUUID()}.webp`;

  await uploadStorageFile({
    bucket: PROJECT_IMAGES_BUCKET,
    path,
    file,
    contentType: WEBP_IMAGE_ACCEPT,
    cacheControl: STORAGE_UPLOAD_CACHE_CONTROL,
  });

  return path;
}

export async function uploadProjectMiniature(
  projectId: string,
  file: File,
): Promise<string> {
  await assertWebpImageFile(file);
  assertBucket(PROJECT_MINIATURES_BUCKET, "project-miniatures");

  const path = getProjectMiniatureStoragePath(projectId, crypto.randomUUID());

  await uploadStorageFile({
    bucket: PROJECT_MINIATURES_BUCKET,
    path,
    file,
    contentType: WEBP_IMAGE_ACCEPT,
    cacheControl: STORAGE_UPLOAD_CACHE_CONTROL,
    errorLabel: `Nie udało się zapisać miniatury w buckecie "${PROJECT_MINIATURES_BUCKET}"`,
  });

  return path;
}

export async function deleteProjectTopicImage(path: string): Promise<void> {
  await deleteStorageFiles(PROJECT_IMAGES_BUCKET, [path]);
}

export async function deleteProjectMiniature(path: string): Promise<void> {
  await deleteStorageFiles(PROJECT_MINIATURES_BUCKET, [path]);
}

export async function deleteProjectMiniatures(
  projectId: string,
): Promise<void> {
  await deleteStorageFolder(PROJECT_MINIATURES_BUCKET, projectId);
  await deleteStorageFiles(PROJECT_MINIATURES_BUCKET, [`${projectId}.webp`]);
}

export async function deleteProjectImages(projectId: string): Promise<void> {
  await deleteStorageFolder(PROJECT_IMAGES_BUCKET, projectId);
}
