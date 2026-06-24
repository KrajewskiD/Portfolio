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
import type { AdminFormSavePreparation } from "@admin/hooks/useAdminFormSave";
import { ensureUuid } from "@shared/database";
import type {
  Project,
  ProjectTopicContent,
} from "@shared/database/types/project";

type PendingKeyedImages = ReturnType<typeof usePendingKeyedImages>;

type ProjectMediaCleanupPlan = {
  miniaturePathsToDeleteAfterSave: string[];
  topicImagePathsToDeleteAfterSave: string[];
  uploadedMiniaturePaths: string[];
  uploadedTopicImagePaths: string[];
};

function createProjectMediaCleanupPlan(): ProjectMediaCleanupPlan {
  return {
    miniaturePathsToDeleteAfterSave: [],
    topicImagePathsToDeleteAfterSave: [],
    uploadedMiniaturePaths: [],
    uploadedTopicImagePaths: [],
  };
}

function getObsoletePaths(pathsToDelete: string[], uploadedPaths: string[]) {
  return [...new Set(pathsToDelete)].filter(
    (path) => !uploadedPaths.includes(path),
  );
}

async function rollbackUploadedProjectMedia(
  cleanupPlan: ProjectMediaCleanupPlan,
): Promise<void> {
  await Promise.all([
    ...cleanupPlan.uploadedMiniaturePaths.map(deleteProjectMiniature),
    ...cleanupPlan.uploadedTopicImagePaths.map(deleteProjectTopicImage),
  ]);
}

async function cleanupObsoleteProjectMedia(
  cleanupPlan: ProjectMediaCleanupPlan,
): Promise<void> {
  const obsoleteMiniaturePaths = getObsoletePaths(
    cleanupPlan.miniaturePathsToDeleteAfterSave,
    cleanupPlan.uploadedMiniaturePaths,
  );
  const obsoleteTopicImagePaths = getObsoletePaths(
    cleanupPlan.topicImagePathsToDeleteAfterSave,
    cleanupPlan.uploadedTopicImagePaths,
  );

  await Promise.all([
    ...obsoleteMiniaturePaths.map(deleteProjectMiniature),
    ...obsoleteTopicImagePaths.map(deleteProjectTopicImage),
  ]);
}

async function prepareProjectMiniatureDraft(
  project: Project,
  originalProjectId: string,
  normalizedProjectId: string,
  miniatures: PendingKeyedImages,
  cleanupPlan: ProjectMediaCleanupPlan,
): Promise<Pick<Project, "miniaturePath" | "miniatureUrl">> {
  const miniatureKey = projectMiniatureKey(originalProjectId);
  const pendingMiniatureFile = miniatures.pendingFiles[miniatureKey];
  const pendingMiniatureRemoval = miniatures.markedForRemovals[miniatureKey];

  if (pendingMiniatureFile) {
    const miniaturePath = await uploadProjectMiniature(
      normalizedProjectId,
      pendingMiniatureFile,
    );
    cleanupPlan.uploadedMiniaturePaths.push(miniaturePath);

    if (project.miniaturePath && project.miniaturePath !== miniaturePath) {
      cleanupPlan.miniaturePathsToDeleteAfterSave.push(project.miniaturePath);
    }

    return {
      miniaturePath,
      miniatureUrl: await getVersionedProjectMiniatureUrl(miniaturePath),
    };
  }

  if (pendingMiniatureRemoval && project.miniaturePath) {
    cleanupPlan.miniaturePathsToDeleteAfterSave.push(project.miniaturePath);

    return {
      miniaturePath: undefined,
      miniatureUrl: undefined,
    };
  }

  return {
    miniaturePath: project.miniaturePath,
    miniatureUrl: project.miniatureUrl,
  };
}

async function prepareProjectTopicImageDraft(
  topic: ProjectTopicContent,
  originalProjectId: string,
  normalizedProjectId: string,
  topicImages: PendingKeyedImages,
  cleanupPlan: ProjectMediaCleanupPlan,
): Promise<ProjectTopicContent> {
  const key = topicImageKey(originalProjectId, topic.id);
  const file = topicImages.pendingFiles[key];
  const markedForRemoval = topicImages.markedForRemovals[key];

  if (file) {
    const imagePath = await uploadProjectTopicImage(
      normalizedProjectId,
      topic.id,
      file,
    );
    cleanupPlan.uploadedTopicImagePaths.push(imagePath);

    if (topic.imagePath && topic.imagePath !== imagePath) {
      cleanupPlan.topicImagePathsToDeleteAfterSave.push(topic.imagePath);
    }

    return {
      ...topic,
      imagePath,
      imageUrl: await getVersionedProjectImageUrl(imagePath),
    };
  }

  if (markedForRemoval && topic.imagePath) {
    cleanupPlan.topicImagePathsToDeleteAfterSave.push(topic.imagePath);

    return {
      ...topic,
      imagePath: undefined,
      imageUrl: undefined,
    };
  }

  return topic;
}

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
    async (
      currentProjects: Project[],
    ): Promise<Project[] | AdminFormSavePreparation<Project[]>> => {
      if (!hasPendingEdits) {
        return currentProjects.map((project) => ({
          ...project,
          id: ensureUuid(project.id),
        }));
      }

      const cleanupPlan = createProjectMediaCleanupPlan();

      try {
        const updatedProjects = await Promise.all(
          currentProjects.map(async (project) => {
            const originalId = project.id;
            const normalizedId = ensureUuid(project.id);
            const miniatureDraft = await prepareProjectMiniatureDraft(
              project,
              originalId,
              normalizedId,
              miniatures,
              cleanupPlan,
            );

            return {
              ...project,
              id: normalizedId,
              ...miniatureDraft,
              topics: await Promise.all(
                project.topics.map((topic) =>
                  prepareProjectTopicImageDraft(
                    topic,
                    originalId,
                    normalizedId,
                    topicImages,
                    cleanupPlan,
                  ),
                ),
              ),
            };
          }),
        );

        return {
          value: updatedProjects,
          onSaveSuccess: async () => {
            await cleanupObsoleteProjectMedia(cleanupPlan);
            discardAll();
          },
          onSaveError: async () => {
            await rollbackUploadedProjectMedia(cleanupPlan);
          },
        };
      } catch (error) {
        try {
          await rollbackUploadedProjectMedia(cleanupPlan);
        } catch (cleanupError) {
          console.error(
            "Preparing project media failed and upload cleanup failed:",
            cleanupError,
          );
        }

        throw error;
      }
    },
    [discardAll, hasPendingEdits, miniatures, topicImages],
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
