import { supabase } from "@admin/lib/supabase";
import {
  PROFILE_IMAGES_BUCKET,
  PROJECT_IMAGES_BUCKET,
  PROJECT_VIDEOS_BUCKET,
  createBucketUrlResolver,
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

export {
  getProfileImagePublicUrl,
  getProjectImagePublicUrl,
  getProjectVideoPublicUrl,
};

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
