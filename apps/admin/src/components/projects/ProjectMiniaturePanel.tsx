import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import { AdminLocalizedInput } from "@admin/components/ui/AdminLocalizedField";
import type { ProjectMiniatureAltField } from "@admin/forms/projects/projectEditorTypes";
import { PROJECT_MINIATURES_BUCKET } from "@shared/database";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";
import { getLocalizedField } from "@shared/utils/localizedField";

type ProjectMiniaturePanelProps = {
  project: Project;
  language: Language;
  selectedFile?: File | null;
  imageMarkedForRemoval?: boolean;
  disabled?: boolean;
  onChange: (field: ProjectMiniatureAltField, value: string) => void;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange?: (marked: boolean) => void;
};

function ProjectMiniaturePanel({
  project,
  language,
  selectedFile,
  imageMarkedForRemoval = false,
  disabled = false,
  onChange,
  onFileSelect,
  onImageMarkedForRemovalChange,
}: ProjectMiniaturePanelProps) {
  const projectTitle = getLocalizedField(
    project,
    language,
    "titlePl",
    "titleEn",
  );
  const previewAlt =
    getLocalizedField(project, language, "miniatureAltPl", "miniatureAltEn") ||
    projectTitle;

  return (
    <div className="admin-image-column admin-image-column--fluid">
      <AdminImagePicker
        label="Miniatura projektu"
        hint={`Zapisuje się w Supabase Storage, bucket „${PROJECT_MINIATURES_BUCKET}”. To osobny plik — nie nadpisuje zdjęcia profilowego.`}
        imageUrl={project.miniatureUrl}
        selectedFile={selectedFile}
        imageMarkedForRemoval={imageMarkedForRemoval}
        previewAlt={previewAlt}
        emptyLabel="Brak miniatury w siatce wyboru projektów"
        disabled={disabled}
        onFileSelect={onFileSelect}
        onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
      />

      <AdminLocalizedInput
        id="project-miniature-alt"
        label="Opis alternatywny miniatury"
        language={language}
        disabled={disabled}
        source={project}
        plKey="miniatureAltPl"
        enKey="miniatureAltEn"
        onChange={onChange}
      />
    </div>
  );
}

export default ProjectMiniaturePanel;
