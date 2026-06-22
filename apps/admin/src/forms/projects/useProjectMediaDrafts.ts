import { useCallback } from "react";

import {
  projectMiniatureKey,
  topicImageKey,
} from "@admin/forms/projects/projectMediaKeys";
import { usePendingKeyedImages } from "@admin/hooks/usePendingKeyedImages";
import {
  deleteProjectMiniature,
  deleteProjectTopicImage,
  getVersionedProjectImageUrl,
  getVersionedProjectMiniatureUrl,
  uploadProjectMiniature,
  uploadProjectTopicImage,
} from "@admin/lib/imageStorage";
import { ensureUuid } from "@shared/database";
import type { Project } from "@shared/database/types/project";

export function useProjectMediaDrafts() {
  const topicImages = usePendingKeyedImages();
  const miniatures = usePendingKeyedImages();

  const hasPendingEdits =
    topicImages.hasPendingEdits || miniatures.hasPendingEdits;

  const discardAll = useCallback(() => {
    topicImages.discardPending();
    miniatures.discardPending();
  }, [miniatures, topicImages]);

  const clearKeysForProject = useCallback(
    (projectId: string) => {
      topicImages.clearKeysForPrefix(projectId);
      miniatures.clearKeysForPrefix(projectId);
    },
    [miniatures, topicImages],
  );

  const prepareBeforeSave = useCallback(
    async (currentProjects: Project[]) => {
      if (!hasPendingEdits) {
        return currentProjects.map((project) => ({
          ...project,
          id: ensureUuid(project.id),
        }));
      }

      const updatedProjects = await Promise.all(
        currentProjects.map(async (project) => {
          const originalId = project.id;
          const normalizedId = ensureUuid(project.id);
          const miniatureKey = projectMiniatureKey(originalId);
          const pendingMiniatureFile = miniatures.pendingFiles[miniatureKey];
          const pendingMiniatureRemoval =
            miniatures.markedForRemovals[miniatureKey];
          let nextMiniaturePath = project.miniaturePath;
          let nextMiniatureUrl = project.miniatureUrl;

          if (pendingMiniatureFile) {
            if (project.miniaturePath && normalizedId !== originalId) {
              await deleteProjectMiniature(project.miniaturePath);
            }

            nextMiniaturePath = await uploadProjectMiniature(
              normalizedId,
              pendingMiniatureFile,
            );
            nextMiniatureUrl = await getVersionedProjectMiniatureUrl(
              nextMiniaturePath,
            );
          } else if (pendingMiniatureRemoval && project.miniaturePath) {
            await deleteProjectMiniature(project.miniaturePath);
            nextMiniaturePath = undefined;
            nextMiniatureUrl = undefined;
          }

          return {
            ...project,
            id: normalizedId,
            miniaturePath: nextMiniaturePath,
            miniatureUrl: nextMiniatureUrl,
            topics: await Promise.all(
              project.topics.map(async (topic) => {
                const key = topicImageKey(originalId, topic.id);
                const file = topicImages.pendingFiles[key];
                const markedForRemoval = topicImages.markedForRemovals[key];

                if (file) {
                  const imagePath = await uploadProjectTopicImage(
                    normalizedId,
                    topic.id,
                    file,
                  );

                  return {
                    ...topic,
                    imagePath,
                    imageUrl: await getVersionedProjectImageUrl(imagePath),
                  };
                }

                if (markedForRemoval && topic.imagePath) {
                  await deleteProjectTopicImage(topic.imagePath);

                  return {
                    ...topic,
                    imagePath: undefined,
                    imageUrl: undefined,
                  };
                }

                return topic;
              }),
            ),
          };
        }),
      );

      discardAll();
      return updatedProjects;
    },
    [
      discardAll,
      hasPendingEdits,
      miniatures.markedForRemovals,
      miniatures.pendingFiles,
      topicImages.markedForRemovals,
      topicImages.pendingFiles,
    ],
  );

  return {
    topicImages,
    miniatures,
    hasPendingEdits,
    discardAll,
    clearKeysForProject,
    prepareBeforeSave,
  };
}
