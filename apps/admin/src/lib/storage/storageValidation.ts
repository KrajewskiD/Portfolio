import {
  validateWebpImageFile,
} from "@shared/utils/webpImage";

export function assertBucket(bucket: string, expectedBucket: string): void {
  if (bucket !== expectedBucket) {
    throw new Error(
      `Błędna konfiguracja storage: oczekiwano "${expectedBucket}", otrzymano "${bucket}".`,
    );
  }
}

export async function assertWebpImageFile(file: File): Promise<void> {
  const validation = await validateWebpImageFile(file);

  if (!validation.valid) {
    throw new Error(validation.message);
  }
}
