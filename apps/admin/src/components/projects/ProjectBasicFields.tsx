import AdminTextField from "@admin/components/ui/AdminTextField";
import type { Project } from "@shared/database/types/project";

type ProjectBasicFieldsProps = {
  project: Project;
  disabled?: boolean;
  onUpdate: (field: "code" | "projectUrl", value: string) => void;
};

function ProjectBasicFields({
  project,
  disabled = false,
  onUpdate,
}: ProjectBasicFieldsProps) {
  return (
    <>
      <AdminTextField
        id="project-code"
        label="Kod projektu"
        value={project.code ?? ""}
        disabled={disabled}
        onChange={(value) => onUpdate("code", value)}
      />

      <AdminTextField
        id="project-url"
        label="Link do projektu"
        hint="Bezpośredni adres URL do projektu, np. repozytorium, demo lub strona produktu."
        type="url"
        placeholder="https://"
        value={project.projectUrl ?? ""}
        disabled={disabled}
        onChange={(value) => onUpdate("projectUrl", value)}
      />
    </>
  );
}

export default ProjectBasicFields;
