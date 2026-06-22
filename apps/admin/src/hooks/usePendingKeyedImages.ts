import { useCallback, useState } from "react";

export type PendingFileHandlers = {
  onFileSelect: (file: File | null) => void;
  onMarkedForRemovalChange: (marked: boolean) => void;
};

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

  const getHandlers = useCallback(
    (key: string): PendingFileHandlers => ({
      onFileSelect: (file) => {
        setPendingFiles((current) => {
          if (!file) {
            const next = { ...current };
            delete next[key];
            return next;
          }

          return { ...current, [key]: file };
        });

        if (file) {
          setMarkedForRemovals((current) => {
            if (!current[key]) {
              return current;
            }

            const next = { ...current };
            delete next[key];
            return next;
          });
        }
      },
      onMarkedForRemovalChange: (marked) => {
        setMarkedForRemovals((current) => {
          if (marked) {
            return { ...current, [key]: true };
          }

          if (!current[key]) {
            return current;
          }

          const next = { ...current };
          delete next[key];
          return next;
        });
      },
    }),
    [],
  );

  const getDraft = useCallback(
    (key: string) => ({
      selectedFile: pendingFiles[key] ?? null,
      markedForRemoval: markedForRemovals[key] ?? false,
      handlers: getHandlers(key),
    }),
    [getHandlers, markedForRemovals, pendingFiles],
  );

  return {
    pendingFiles,
    setPendingFiles,
    markedForRemovals,
    setMarkedForRemovals,
    hasPendingEdits,
    discardPending,
    clearKeysForPrefix,
    getHandlers,
    getDraft,
  };
}
