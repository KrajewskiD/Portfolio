import { useCallback, useRef, useState } from "react";

export function usePendingSingleImage() {
  const [pendingFile, setPendingFileState] = useState<File | null>(null);
  const pendingFileRef = useRef<File | null>(null);
  const [markedForRemoval, setMarkedForRemoval] = useState(false);

  const hasPendingEdits = pendingFile !== null || markedForRemoval;

  const setPendingFile = useCallback((file: File | null) => {
    pendingFileRef.current = file;
    setPendingFileState(file);
  }, []);

  const discardPending = useCallback(() => {
    pendingFileRef.current = null;
    setPendingFileState(null);
    setMarkedForRemoval(false);
  }, []);

  return {
    pendingFile,
    pendingFileRef,
    setPendingFile,
    markedForRemoval,
    setMarkedForRemoval,
    hasPendingEdits,
    discardPending,
  };
}
