import { useCallback } from "react";

import {
  deleteProfileImage,
  getVersionedProfileImageUrl,
  uploadProfileImage,
} from "@admin/lib/imageStorage";
import type { AdminFormSavePreparation } from "@admin/hooks/useAdminFormSave";
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
    async (
      currentProfile: Profile,
    ): Promise<AdminFormSavePreparation<Profile>> => {
      let nextProfile = currentProfile;
      const uploadedPaths: string[] = [];
      const pathsToDeleteAfterSave: string[] = [];

      try {
        if (markedForRemoval && currentProfile.imagePath) {
          pathsToDeleteAfterSave.push(currentProfile.imagePath);
          nextProfile = {
            ...currentProfile,
            imagePath: undefined,
            imageUrl: undefined,
          };
        }

        if (pendingFileRef.current) {
          const imagePath = await uploadProfileImage(pendingFileRef.current);
          uploadedPaths.push(imagePath);

          if (
            currentProfile.imagePath &&
            currentProfile.imagePath !== imagePath
          ) {
            pathsToDeleteAfterSave.push(currentProfile.imagePath);
          }

          nextProfile = {
            ...nextProfile,
            imagePath,
            imageUrl: await getVersionedProfileImageUrl(imagePath),
          };
        }
      } catch (error) {
        try {
          await Promise.all(uploadedPaths.map(deleteProfileImage));
        } catch (cleanupError) {
          console.error(
            "Preparing profile image failed and upload cleanup failed:",
            cleanupError,
          );
        }

        throw error;
      }

      return {
        value: nextProfile,
        onSaveSuccess: async () => {
          const uniquePathsToDelete = [
            ...new Set(pathsToDeleteAfterSave),
          ].filter((path) => !uploadedPaths.includes(path));

          await Promise.all(uniquePathsToDelete.map(deleteProfileImage));
          setPendingFile(null);
          setMarkedForRemoval(false);
        },
        onSaveError: async () => {
          await Promise.all(uploadedPaths.map(deleteProfileImage));
        },
      };
    },
    [markedForRemoval, pendingFileRef, setMarkedForRemoval, setPendingFile],
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
