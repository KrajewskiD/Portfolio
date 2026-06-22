import { supabase } from "@admin/lib/supabase";
import {
  deleteStorageFiles,
  deleteStorageFolder,
  uploadStorageFile,
} from "@admin/lib/storageOperations";
import { PROJECT_VIDEOS_BUCKET, createBucketUrlResolver } from "@shared/database";
import {
  getProjectVideoExtension,
  validateProjectVideoFile,
} from "@shared/utils/videoFile";

export const getProjectVideoPublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_VIDEOS_BUCKET,
);

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

  await uploadStorageFile({
    bucket: PROJECT_VIDEOS_BUCKET,
    path,
    file,
    contentType,
  });

  return path;
}

export async function deleteProjectVideo(path: string): Promise<void> {
  await deleteStorageFiles(PROJECT_VIDEOS_BUCKET, [path]);
}

export async function deleteProjectVideos(projectId: string): Promise<void> {
  await deleteStorageFolder(PROJECT_VIDEOS_BUCKET, projectId);
}
