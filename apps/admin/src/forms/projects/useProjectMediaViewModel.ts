import { useMemo } from "react";

import type { useProjectMediaDrafts } from "@admin/forms/projects/useProjectMediaDrafts";
import type { useProjectsEditor } from "@admin/forms/projects/useProjectsEditor";

export type ProjectMediaDraftState = {
  selectedFile: File | null;
  markedForRemoval: boolean;
  handlers: {
    onFileSelect: (file: File | null) => void;
    onMarkedForRemovalChange: (marked: boolean) => void;
  };
};

type ProjectsEditorState = Pick<
  ReturnType<typeof useProjectsEditor>,
  "activeProjectMiniatureKey" | "activeTopicImageKey"
>;

type ProjectMediaDraftsState = ReturnType<typeof useProjectMediaDrafts>;

export function useProjectMediaViewModel(
  editor: ProjectsEditorState,
  media: ProjectMediaDraftsState,
) {
  return useMemo(
    () => ({
      miniature: media.miniatures.getDraft(editor.activeProjectMiniatureKey),
      topicImage: media.topicImages.getDraft(editor.activeTopicImageKey),
    }),
    [
      editor.activeProjectMiniatureKey,
      editor.activeTopicImageKey,
      media.miniatures,
      media.topicImages,
    ],
  );
}
