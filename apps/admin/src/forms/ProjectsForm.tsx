import { useMemo } from "react";

import ProjectEditorLayout from "@admin/components/projects/ProjectEditorLayout";
import ProjectFormActions from "@admin/components/projects/ProjectFormActions";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import { projectDrafts } from "@admin/data/adminDrafts";
import { useProjectMediaDrafts } from "@admin/forms/projects/useProjectMediaDrafts";
import { useProjectsEditor } from "@admin/forms/projects/useProjectsEditor";
import { useActiveTopicImageHandlers } from "@admin/hooks/useActiveTopicImageHandlers";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  getAdminProjects,
  saveAdminProjects,
} from "@admin/database/projects/ProjectRepository";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { Project } from "@shared/database/types/project";

function ProjectsForm({ language }: AdminFormProps) {
  const media = useProjectMediaDrafts();
  const { isOverlayOpen } = useTranslationOverlay();

  const {
    value: projects,
    setValue: setProjects,
    syncSavedValue,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminForm<Project[]>({
    initialValue: projectDrafts,
    loadValue: getAdminProjects,
    saveValue: saveAdminProjects,
    prepareBeforeSave: media.prepareBeforeSave,
    extraDirty: media.hasPendingEdits,
    onDiscard: media.discardAll,
  });

  const isBusy = isLoading || isSaving || isOverlayOpen;

  const editor = useProjectsEditor({
    language,
    projects,
    setProjects,
    syncSavedValue,
    clearKeysForProject: media.clearKeysForProject,
    isBusy,
  });

  const isFormBusy = isBusy || editor.isDeleting;

  const topicImageHandlers = useActiveTopicImageHandlers(
    editor.activeTopicImageKey,
    media.topicImages.setPendingFiles,
    media.topicImages.setMarkedForRemovals,
  );

  const videoHandlers = useActiveTopicImageHandlers(
    editor.activeProjectVideoKey,
    media.videos.setPendingFiles,
    media.videos.setMarkedForRemovals,
  );

  const miniatureHandlers = useActiveTopicImageHandlers(
    editor.activeProjectMiniatureKey,
    media.miniatures.setPendingFiles,
    media.miniatures.setMarkedForRemovals,
  );

  const extraErrors = useMemo(
    () =>
      [
        ...(editor.bulkTranslate.error ? [editor.bulkTranslate.error] : []),
        ...(editor.deleteError ? [editor.deleteError] : []),
      ],
    [editor.bulkTranslate.error, editor.deleteError],
  );

  return (
    <AdminFormShell
      title="Projekty"
      description="Edytuj projekt, jego technologie oraz treści przypisane do konkretnych zakładek."
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      extraErrors={extraErrors}
      actions={
        <ProjectFormActions
          language={language}
          projects={projects}
          activeProjectId={editor.activeProjectId}
          hasActiveProject={Boolean(editor.activeProject)}
          isLoading={isLoading}
          isSaving={isSaving}
          isFormBusy={isFormBusy}
          isBulkTranslating={editor.bulkTranslate.isTranslating}
          onSelectProject={editor.selectProject}
          onDeleteProject={() => void editor.deleteProject()}
          onAddProject={editor.addProject}
          onSave={save}
          onTranslateAll={editor.bulkTranslate.onTranslateAll}
        />
      }
    >
      {!editor.activeProject || !editor.activeTopic ? (
        <AdminEmptyMessage>
          Brak projektów. Dodaj pierwszy projekt, aby rozpocząć edycję.
        </AdminEmptyMessage>
      ) : (
        <ProjectEditorLayout
          language={language}
          project={editor.activeProject}
          topic={editor.activeTopic}
          projectTitle={editor.activeProjectTitle}
          disabled={isFormBusy}
          miniature={{
            selectedFile:
              media.miniatures.pendingFiles[editor.activeProjectMiniatureKey] ??
              null,
            markedForRemoval:
              media.miniatures.markedForRemovals[
                editor.activeProjectMiniatureKey
              ] ?? false,
            handlers: {
              onFileSelect: miniatureHandlers.onFileSelect,
              onMarkedForRemovalChange:
                miniatureHandlers.onImageMarkedForRemovalChange,
            },
          }}
          topicImage={{
            selectedFile:
              media.topicImages.pendingFiles[editor.activeTopicImageKey] ?? null,
            markedForRemoval:
              media.topicImages.markedForRemovals[editor.activeTopicImageKey] ??
              false,
            handlers: {
              onFileSelect: topicImageHandlers.onFileSelect,
              onMarkedForRemovalChange:
                topicImageHandlers.onImageMarkedForRemovalChange,
            },
          }}
          video={{
            selectedFile:
              media.videos.pendingFiles[editor.activeProjectVideoKey] ?? null,
            markedForRemoval:
              media.videos.markedForRemovals[editor.activeProjectVideoKey] ??
              false,
            handlers: {
              onFileSelect: videoHandlers.onFileSelect,
              onMarkedForRemovalChange:
                videoHandlers.onImageMarkedForRemovalChange,
            },
          }}
          onUpdateProject={editor.updateProject}
          onUpdateTopic={editor.updateTopic}
          onTopicTabChange={editor.setActiveTopicId}
          onAddTechnology={editor.addTechnology}
          onUpdateTechnology={editor.updateTechnology}
          onRemoveTechnology={editor.removeTechnology}
        />
      )}
    </AdminFormShell>
  );
}

export default ProjectsForm;
