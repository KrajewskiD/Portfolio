import type { SupabaseClient } from "@supabase/supabase-js";

export type ResolveStorageImageUrlOptions = {
  forceVersion?: string | number;
};

export function appendCacheBust(url: string, version: string | number): string {
  const [base] = url.split("?");
  const params = new URLSearchParams(
    url.includes("?") ? url.split("?")[1] : "",
  );
  params.set("v", String(version));

  return `${base}?${params.toString()}`;
}

function getStorageFolderAndFileName(path: string): {
  folder: string;
  fileName: string;
} {
  const separatorIndex = path.lastIndexOf("/");

  if (separatorIndex === -1) {
    return { folder: "", fileName: path };
  }

  return {
    folder: path.slice(0, separatorIndex),
    fileName: path.slice(separatorIndex + 1),
  };
}

export async function resolveStorageImageUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  getPublicUrl: (path: string) => string,
  options?: ResolveStorageImageUrlOptions,
): Promise<string | undefined> {
  const baseUrl = getPublicUrl(path);

  if (options?.forceVersion !== undefined) {
    return appendCacheBust(baseUrl, options.forceVersion);
  }

  const { folder, fileName } = getStorageFolderAndFileName(path);

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { search: fileName, limit: 100 });

  if (error) {
    return undefined;
  }

  const file = data?.find((entry) => entry.name === fileName);

  if (!file) {
    return undefined;
  }

  const version = file.updated_at ?? file.created_at;

  return version ? appendCacheBust(baseUrl, version) : baseUrl;
}
