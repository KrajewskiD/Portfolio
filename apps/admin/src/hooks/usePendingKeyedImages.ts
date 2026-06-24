import { useCallback, useState } from "react";

export type PendingFileHandlers = {
  onFileSelect: (file: File | null) => void;
  onMarkedForRemovalChange: (marked: boolean) => void;
};

function omitKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  if (!(key in record)) {
    return record;
  }

  const next = { ...record };
  delete next[key];
  return next;
}

function omitKeysForPrefix<T>(
  record: Record<string, T>,
  prefix: string,
): Record<string, T> {
  const keyPrefix = `${prefix}:`;
  const nextEntries = Object.entries(record).filter(
    ([key]) => !key.startsWith(keyPrefix),
  );

  if (nextEntries.length === Object.keys(record).length) {
    return record;
  }

  return Object.fromEntries(nextEntries);
}

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
    setPendingFiles((current) => omitKeysForPrefix(current, prefix));
    setMarkedForRemovals((current) => omitKeysForPrefix(current, prefix));
  }, []);

  const getHandlers = useCallback(
    (key: string): PendingFileHandlers => ({
      onFileSelect: (file) => {
        setPendingFiles((current) => {
          if (!file) {
            return omitKey(current, key);
          }

          return { ...current, [key]: file };
        });

        if (file) {
          setMarkedForRemovals((current) => {
            if (!current[key]) {
              return current;
            }

            return omitKey(current, key);
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

          return omitKey(current, key);
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
