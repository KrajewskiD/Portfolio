import { useMemo } from "react";

import { projectDrafts } from "@admin/data/adminDrafts";
import { useProjectMediaDrafts } from "@admin/forms/projects/useProjectMediaDrafts";
import { useProjectMediaViewModel } from "@admin/forms/projects/useProjectMediaViewModel";
import { useProjectsEditor } from "@admin/forms/projects/useProjectsEditor";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  getAdminProjects,
  saveAdminProjects,
} from "@admin/database/projects/ProjectRepository";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";

export function useProjectsForm(language: Language) {
  const media = useProjectMediaDrafts();
  const { isOverlayOpen } = useTranslationOverlay();

  const form = useAdminForm<Project[]>({
    initialValue: projectDrafts,
    loadValue: getAdminProjects,
    saveValue: saveAdminProjects,
    prepareBeforeSave: media.prepareBeforeSave,
    extraDirty: media.hasPendingEdits,
    onDiscard: media.discardAll,
  });

  const isBusy = form.isLoading || form.isSaving || isOverlayOpen;

  const editor = useProjectsEditor({
    language,
    projects: form.value,
    setProjects: form.setValue,
    syncSavedValue: form.syncSavedValue,
    clearKeysForProject: media.clearKeysForProject,
    isBusy,
  });

  const isFormBusy = isBusy || editor.isDeleting;
  const mediaViewModel = useProjectMediaViewModel(editor, media);

  const extraErrors = useMemo(
    () => [
      ...(editor.bulkTranslate.error ? [editor.bulkTranslate.error] : []),
      ...(editor.deleteError ? [editor.deleteError] : []),
    ],
    [editor.bulkTranslate.error, editor.deleteError],
  );

  return {
    projects: form.value,
    isLoading: form.isLoading,
    isSaving: form.isSaving,
    loadError: form.loadError,
    saveError: form.saveError,
    saveSuccess: form.saveSuccess,
    save: form.save,
    extraErrors,
    editor,
    isFormBusy,
    mediaViewModel,
  };
}
