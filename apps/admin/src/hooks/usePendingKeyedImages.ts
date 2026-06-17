import { useCallback, useState } from "react";

export function usePendingKeyedImages() {
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [markedForRemovals, setMarkedForRemovals] = useState<
    Record<string, boolean>
  >({});

  const hasPendingEdits =
    Object.keys(pendingFiles).length > 0 ||
    Object.values(markedForRemovals).some(Boolean);

  const discardPending = useCallback(() => {
    setPendingFiles({});
    setMarkedForRemovals({});
  }, []);

  const clearKeysForPrefix = useCallback((prefix: string) => {
    setPendingFiles((current) => {
      const next = { ...current };

      for (const key of Object.keys(next)) {
        if (key.startsWith(`${prefix}:`)) {
          delete next[key];
        }
      }

      return next;
    });

    setMarkedForRemovals((current) => {
      const next = { ...current };

      for (const key of Object.keys(next)) {
        if (key.startsWith(`${prefix}:`)) {
          delete next[key];
        }
      }

      return next;
    });
  }, []);

  return {
    pendingFiles,
    setPendingFiles,
    markedForRemovals,
    setMarkedForRemovals,
    hasPendingEdits,
    discardPending,
    clearKeysForPrefix,
  };
}
