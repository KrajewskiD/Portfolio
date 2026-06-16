import { supabase } from "@admin/lib/supabase";

function getFileExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp"
  ) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  return "jpg";
}

export function getProfileImagePublicUrl(path: string): string {
  return supabase.storage.from("profile-images").getPublicUrl(path).data
    .publicUrl;
}

export function getProjectImagePublicUrl(path: string): string {
  return supabase.storage.from("project-images").getPublicUrl(path).data
    .publicUrl;
}

export async function uploadProfileImage(file: File): Promise<string> {
  const path = `profile.${getFileExtension(file)}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(path, file, { upsert: true, contentType: file.type });

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
  const path = `${projectId}/${topicId}.${getFileExtension(file)}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    throw error;
  }

  return path;
}
