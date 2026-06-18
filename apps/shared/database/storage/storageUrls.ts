import type { SupabaseClient } from "@supabase/supabase-js";

export function getStoragePublicUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export const PROFILE_IMAGES_BUCKET = "profile-images";
export const PROJECT_IMAGES_BUCKET = "project-images";
export const PROJECT_VIDEOS_BUCKET = "project-videos";

export function createBucketUrlResolver(
  supabase: SupabaseClient,
  bucket: string,
): (path: string) => string {
  return (path: string) => getStoragePublicUrl(supabase, bucket, path);
}
