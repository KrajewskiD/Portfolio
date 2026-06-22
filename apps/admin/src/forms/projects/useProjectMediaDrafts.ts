import { useCallback } from "react";

import {
  projectMiniatureKey,
  projectVideoKey,
  topicImageKey,
} from "@admin/forms/projects/projectMediaKeys";
import { usePendingKeyedImages } from "@admin/hooks/usePendingKeyedImages";
import {
  deleteProjectMiniature,
  deleteProjectTopicImage,
  deleteProjectVideo,
  getProjectVideoPublicUrl,
  getVersionedProjectImageUrl,
  getVersionedProjectMiniatureUrl,
  uploadProjectMiniature,
  uploadProjectTopicImage,
  uploadProjectVideo,
} from "@admin/lib/imageStorage";
import { ensureUuid } from "@shared/database";
import type { Project } from "@shared/database/types/project";

export function useProjectMediaDrafts() {
  const topicImages = usePendingKeyedImages();
  const videos = usePendingKeyedImages();
  const miniatures = usePendingKeyedImages();

  const hasPendingEdits =
    topicImages.hasPendingEdits ||
    videos.hasPendingEdits ||
    miniatures.hasPendingEdits;

  const discardAll = useCallback(() => {
    topicImages.discardPending();
    videos.discardPending();
    miniatures.discardPending();
  }, [miniatures, topicImages, videos]);

  const clearKeysForProject = useCallback(
    (projectId: string) => {
      topicImages.clearKeysForPrefix(projectId);
      videos.clearKeysForPrefix(projectId);
      miniatures.clearKeysForPrefix(projectId);
    },
    [miniatures, topicImages, videos],
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
          const videoKey = projectVideoKey(originalId);
          const miniatureKey = projectMiniatureKey(originalId);
          const pendingVideoFile = videos.pendingFiles[videoKey];
          const pendingVideoRemoval = videos.markedForRemovals[videoKey];
          const pendingMiniatureFile = miniatures.pendingFiles[miniatureKey];
          const pendingMiniatureRemoval =
            miniatures.markedForRemovals[miniatureKey];
          let nextVideoPath = project.videoPath;
          let nextVideoUrl = project.videoUrl;
          let nextMiniaturePath = project.miniaturePath;
          let nextMiniatureUrl = project.miniatureUrl;

          if (pendingVideoFile) {
            nextVideoPath = await uploadProjectVideo(
              normalizedId,
              pendingVideoFile,
            );
            nextVideoUrl = getProjectVideoPublicUrl(nextVideoPath);
          } else if (pendingVideoRemoval && project.videoPath) {
            await deleteProjectVideo(project.videoPath);
            nextVideoPath = undefined;
            nextVideoUrl = undefined;
          }

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
            videoPath: nextVideoPath,
            videoUrl: nextVideoUrl,
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
      videos.markedForRemovals,
      videos.pendingFiles,
    ],
  );

  return {
    topicImages,
    videos,
    miniatures,
    hasPendingEdits,
    discardAll,
    clearKeysForProject,
    prepareBeforeSave,
  };
}
