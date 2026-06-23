import ProjectEditorLayout from "@admin/components/projects/ProjectEditorLayout";
import ProjectFormActions from "@admin/components/projects/ProjectFormActions";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import { useProjectsForm } from "@admin/forms/projects/useProjectsForm";
import type { AdminFormProps } from "@admin/types/adminForms";

function ProjectsForm({ language }: AdminFormProps) {
  const {
    projects,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
    extraErrors,
    editor,
    isFormBusy,
    mediaViewModel,
  } = useProjectsForm(language);

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
          disabled={isFormBusy}
          miniature={mediaViewModel.miniature}
          topicImage={mediaViewModel.topicImage}
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
