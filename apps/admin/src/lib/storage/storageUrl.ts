import { supabase } from "@admin/lib/supabase";
import { appendCacheBust, resolveStorageImageUrl } from "@shared/database";

export async function getVersionedStorageUrl(
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

  return versionedUrl ?? appendCacheBust(getPublicUrl(path), forceVersion);
}
