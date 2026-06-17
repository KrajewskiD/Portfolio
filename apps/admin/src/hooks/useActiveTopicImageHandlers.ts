import { useCallback } from "react";

import type { usePendingKeyedImages } from "@admin/hooks/usePendingKeyedImages";

type PendingKeyedImagesState = ReturnType<typeof usePendingKeyedImages>;

export function useActiveTopicImageHandlers(
  imageKey: string,
  setPendingTopicImages: PendingKeyedImagesState["setPendingFiles"],
  setPendingTopicImageRemovals: PendingKeyedImagesState["setMarkedForRemovals"],
) {
  const onFileSelect = useCallback(
    (file: File | null) => {
      setPendingTopicImages((current) => {
        if (!file) {
          const next = { ...current };
          delete next[imageKey];
          return next;
        }

        return { ...current, [imageKey]: file };
      });

      if (file) {
        setPendingTopicImageRemovals((current) => {
          if (!current[imageKey]) {
            return current;
          }

          const next = { ...current };
          delete next[imageKey];
          return next;
        });
      }
    },
    [imageKey, setPendingTopicImageRemovals, setPendingTopicImages],
  );

  const onImageMarkedForRemovalChange = useCallback(
    (marked: boolean) => {
      setPendingTopicImageRemovals((current) => {
        if (marked) {
          return { ...current, [imageKey]: true };
        }

        if (!current[imageKey]) {
          return current;
        }

        const next = { ...current };
        delete next[imageKey];
        return next;
      });
    },
    [imageKey, setPendingTopicImageRemovals],
  );

  return { onFileSelect, onImageMarkedForRemovalChange };
}
