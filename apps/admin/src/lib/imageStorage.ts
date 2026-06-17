import { supabase } from "@admin/lib/supabase";
import { validateWebpImageFile, WEBP_IMAGE_ACCEPT } from "@shared/utils/webpImage";

export function getProfileImagePublicUrl(path: string): string {
  return supabase.storage.from("profile-images").getPublicUrl(path).data
    .publicUrl;
}

export function getProjectImagePublicUrl(path: string): string {
  return supabase.storage.from("project-images").getPublicUrl(path).data
    .publicUrl;
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
    .from("profile-images")
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
    .from("project-images")
    .upload(path, file, { upsert: true, contentType: WEBP_IMAGE_ACCEPT });

  if (error) {
    throw error;
  }

  return path;
}

export async function deleteProfileImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from("profile-images").remove([path]);

  if (error) {
    throw error;
  }
}

export async function deleteProjectTopicImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from("project-images").remove([path]);

  if (error) {
    throw error;
  }
}
