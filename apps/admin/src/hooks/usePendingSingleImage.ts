import { useCallback, useState } from "react";

export function usePendingSingleImage() {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [markedForRemoval, setMarkedForRemoval] = useState(false);

  const hasPendingEdits = pendingFile !== null || markedForRemoval;

  const discardPending = useCallback(() => {
    setPendingFile(null);
    setMarkedForRemoval(false);
  }, []);

  return {
    pendingFile,
    setPendingFile,
    markedForRemoval,
    setMarkedForRemoval,
    hasPendingEdits,
    discardPending,
  };
}
