import { supabase } from "@admin/lib/supabase";
import { createStorageOperations } from "@admin/lib/storageOperations";
import {
  PROFILE_IMAGES_BUCKET,
  assertValidProfileImagePath,
  createBucketUrlResolver,
  getProfileImageStoragePath,
} from "@shared/database";
import { WEBP_IMAGE_ACCEPT } from "@shared/utils/webpImage";

import { STORAGE_UPLOAD_CACHE_CONTROL } from "./storageConstants";
import { assertBucket, assertWebpImageFile } from "./storageValidation";
import { getVersionedStorageUrl } from "./storageUrl";

const { deleteStorageFiles, uploadStorageFile } =
  createStorageOperations(supabase);

export const getProfileImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROFILE_IMAGES_BUCKET,
);

export async function getVersionedProfileImageUrl(
  path: string,
): Promise<string> {
  return getVersionedStorageUrl(
    PROFILE_IMAGES_BUCKET,
    path,
    getProfileImagePublicUrl,
    Date.now(),
  );
}

export async function uploadProfileImage(file: File): Promise<string> {
  await assertWebpImageFile(file);
  assertBucket(PROFILE_IMAGES_BUCKET, "profile-images");

  const path = getProfileImageStoragePath(crypto.randomUUID());

  await uploadStorageFile({
    bucket: PROFILE_IMAGES_BUCKET,
    path,
    file,
    contentType: WEBP_IMAGE_ACCEPT,
    cacheControl: STORAGE_UPLOAD_CACHE_CONTROL,
    errorLabel: `Nie udało się zapisać zdjęcia profilowego w buckecie "${PROFILE_IMAGES_BUCKET}"`,
  });

  assertValidProfileImagePath(path);
  return path;
}

export async function deleteProfileImage(path: string): Promise<void> {
  assertValidProfileImagePath(path);
  await deleteStorageFiles(PROFILE_IMAGES_BUCKET, [path]);
}
