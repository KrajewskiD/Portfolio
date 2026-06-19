import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import { PROJECT_MINIATURES_BUCKET } from "@shared/database";

type ProjectMiniaturePanelProps = {
  miniatureUrl?: string;
  projectTitle: string;
  selectedFile?: File | null;
  imageMarkedForRemoval?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange?: (marked: boolean) => void;
};

function ProjectMiniaturePanel({
  miniatureUrl,
  projectTitle,
  selectedFile,
  imageMarkedForRemoval = false,
  disabled = false,
  onFileSelect,
  onImageMarkedForRemovalChange,
}: ProjectMiniaturePanelProps) {
  return (
    <AdminImagePicker
      label="Miniatura projektu"
      hint={`Zapisuje się w Supabase Storage, bucket „${PROJECT_MINIATURES_BUCKET}”. To osobny plik — nie nadpisuje zdjęcia profilowego.`}
      imageUrl={miniatureUrl}
      selectedFile={selectedFile}
      imageMarkedForRemoval={imageMarkedForRemoval}
      previewAlt={projectTitle}
      emptyLabel="Brak miniatury w siatce wyboru projektów"
      disabled={disabled}
      onFileSelect={onFileSelect}
      onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
    />
  );
}

export default ProjectMiniaturePanel;
