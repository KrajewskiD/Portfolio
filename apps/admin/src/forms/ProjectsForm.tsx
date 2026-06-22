import { useMemo } from "react";

import ProjectEditorLayout from "@admin/components/projects/ProjectEditorLayout";
import ProjectFormActions from "@admin/components/projects/ProjectFormActions";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
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
  const mediaViewModel = useProjectMediaViewModel(editor, media);

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
          miniature={mediaViewModel.miniature}
          topicImage={mediaViewModel.topicImage}
          video={mediaViewModel.video}
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
