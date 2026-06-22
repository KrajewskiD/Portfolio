import { useCallback } from "react";

import {
  deleteProfileImage,
  getVersionedProfileImageUrl,
  uploadProfileImage,
} from "@admin/services/profileContentService";
import { usePendingSingleImage } from "@admin/hooks/usePendingSingleImage";
import type { Profile } from "@shared/database/types/profile";

export function useProfileImageDraft() {
  const {
    pendingFile,
    pendingFileRef,
    setPendingFile,
    markedForRemoval,
    setMarkedForRemoval,
    hasPendingEdits,
    discardPending,
  } = usePendingSingleImage();

  const prepareBeforeSave = useCallback(
    async (currentProfile: Profile) => {
      let nextProfile = currentProfile;

      if (markedForRemoval && currentProfile.imagePath) {
        await deleteProfileImage(currentProfile.imagePath);
        nextProfile = {
          ...currentProfile,
          imagePath: undefined,
          imageUrl: undefined,
        };
      }

      if (pendingFileRef.current) {
        const imagePath = await uploadProfileImage(pendingFileRef.current);
        setPendingFile(null);

        nextProfile = {
          ...nextProfile,
          imagePath,
          imageUrl: await getVersionedProfileImageUrl(imagePath),
        };
      }

      setMarkedForRemoval(false);
      return nextProfile;
    },
    [
      markedForRemoval,
      pendingFileRef,
      setMarkedForRemoval,
      setPendingFile,
    ],
  );

  const handleFileSelect = useCallback(
    (file: File | null) => {
      setPendingFile(file);

      if (file) {
        setMarkedForRemoval(false);
      }
    },
    [setMarkedForRemoval, setPendingFile],
  );

  return {
    pendingFile,
    markedForRemoval,
    hasPendingEdits,
    discardPending,
    prepareBeforeSave,
    handleFileSelect,
    setMarkedForRemoval,
  };
}
