import { supabase } from "@admin/lib/supabase";

type UploadStorageFileParams = {
  bucket: string;
  path: string;
  file: File | Blob;
  contentType: string;
  cacheControl?: string;
  errorLabel?: string;
};

export async function uploadStorageFile({
  bucket,
  path,
  file,
  contentType,
  cacheControl,
  errorLabel,
}: UploadStorageFileParams): Promise<void> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType,
    ...(cacheControl ? { cacheControl } : {}),
  });

  if (error) {
    throw new Error(
      errorLabel ? `${errorLabel}: ${error.message}` : error.message,
    );
  }
}

export async function deleteStorageFiles(
  bucket: string,
  paths: string[],
): Promise<void> {
  if (paths.length === 0) {
    return;
  }

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    throw error;
  }
}

export async function deleteStorageFolder(
  bucket: string,
  folderPath: string,
): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath);

  if (listError) {
    throw listError;
  }

  if (!files?.length) {
    return;
  }

  const paths = files.map((file) => `${folderPath}/${file.name}`);
  await deleteStorageFiles(bucket, paths);
}
