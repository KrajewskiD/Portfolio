import { supabase } from "@admin/lib/supabase";
import {
  PROFILE_IMAGES_BUCKET,
  PROJECT_IMAGES_BUCKET,
  getStoragePublicUrl,
} from "@shared/database";
import {
  validateWebpImageFile,
  WEBP_IMAGE_ACCEPT,
} from "@shared/utils/webpImage";

export function getProfileImagePublicUrl(path: string): string {
  return getStoragePublicUrl(supabase, PROFILE_IMAGES_BUCKET, path);
}

export function getProjectImagePublicUrl(path: string): string {
  return getStoragePublicUrl(supabase, PROJECT_IMAGES_BUCKET, path);
}

async function assertWebpImageFile(file: File): Promise<void> {
  const validation = await validateWebpImageFile(file);

  if (!validation.valid) {
    throw new Error(validation.message);
  }
}

export async function uploadProfileImage(file: File): Promise<string> {
  await assertWebpImageFile(file);

  const path = "profile.webp";

  const { error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(path, file, { upsert: true, contentType: WEBP_IMAGE_ACCEPT });

  if (error) {
    throw error;
  }

  return path;
}

export async function uploadProjectTopicImage(
  projectId: string,
  topicId: string,
  file: File,
): Promise<string> {
  await assertWebpImageFile(file);

  const path = `${projectId}/${topicId}.webp`;

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(path, file, { upsert: true, contentType: WEBP_IMAGE_ACCEPT });

  if (error) {
    throw error;
  }

  return path;
}

export async function deleteProfileImage(path: string): Promise<void> {
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
