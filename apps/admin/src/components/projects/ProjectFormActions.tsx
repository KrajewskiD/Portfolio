import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminEntitySelect from "@admin/components/ui/AdminEntitySelect";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";
import { getLocalizedField } from "@shared/utils/localizedField";

type ProjectFormActionsProps = {
  language: Language;
  projects: Project[];
  activeProjectId: string;
  hasActiveProject: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isFormBusy: boolean;
  isBulkTranslating: boolean;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: () => void;
  onAddProject: () => void;
  onSave: () => void;
  onTranslateAll: () => void;
};

function ProjectFormActions({
  language,
  projects,
  activeProjectId,
  hasActiveProject,
  isLoading,
  isSaving,
  isFormBusy,
  isBulkTranslating,
  onSelectProject,
  onDeleteProject,
  onAddProject,
  onSave,
  onTranslateAll,
}: ProjectFormActionsProps) {
  return (
    <AdminFormActions>
      <AdminEntitySelect
        id="project-select"
        ariaLabel="Projekt"
        className="w-80 max-w-full"
        value={activeProjectId}
        disabled={isLoading || projects.length === 0}
        items={projects}
        getItemId={(project) => project.id}
        getItemLabel={(project) =>
          getLocalizedField(project, language, "titlePl", "titleEn")
        }
        onChange={onSelectProject}
      />
      <AdminDeleteButton
        label="Usuń projekt"
        disabled={isFormBusy || !hasActiveProject}
        onClick={onDeleteProject}
      />
      <AdminAddButton
        label="Dodaj projekt"
        disabled={isFormBusy}
        onClick={onAddProject}
      />
      <AdminFormSaveActions
        language={language}
        saveDisabled={isFormBusy || projects.length === 0}
        isSaving={isSaving}
        onSave={onSave}
        translateDisabled={isFormBusy || !hasActiveProject}
        isBulkTranslating={isBulkTranslating}
        translateTitle="Przetłumacz wszystkie pola projektu przez Gemini AI"
        onTranslateAll={onTranslateAll}
      />
    </AdminFormActions>
  );
}

export default ProjectFormActions;
