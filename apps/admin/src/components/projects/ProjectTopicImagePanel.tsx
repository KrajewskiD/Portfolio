import AdminInput from "@admin/components/ui/AdminInput";
import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";

export type ProjectTopicImageField = "imageAltPl" | "imageAltEn";

type ProjectTopicImagePanelProps = {
  topic: ProjectTopicContent;
  language: Language;
  selectedFile?: File | null;
  imageMarkedForRemoval?: boolean;
  disabled?: boolean;
  onChange: (field: ProjectTopicImageField, value: string) => void;
  onFileSelect: (file: File | null) => void;
  onImageMarkedForRemovalChange?: (marked: boolean) => void;
};

function ProjectTopicImagePanel({
  topic,
  language,
  selectedFile,
  imageMarkedForRemoval = false,
  disabled = false,
  onChange,
  onFileSelect,
  onImageMarkedForRemovalChange,
}: ProjectTopicImagePanelProps) {
  const imageAltField = language === "pl" ? "imageAltPl" : "imageAltEn";
  const topicLabel = projectTopicLabels[topic.id][language];
  const imageAltFieldId = `${topic.id}-image-alt`;

  return (
    <div className="admin-image-column admin-image-column--fluid">
      <AdminImagePicker
        label={`Zdjęcie: ${topicLabel}`}
        imageUrl={topic.imageUrl}
        selectedFile={selectedFile}
        imageMarkedForRemoval={imageMarkedForRemoval}
        previewAlt={topic[imageAltField]}
        emptyLabel="Brak zdjęcia dla tej zakładki"
        disabled={disabled}
        onFileSelect={onFileSelect}
        onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
      />

      <AdminTranslatableField
        id={imageAltFieldId}
        label="Opis alternatywny zdjęcia"
        language={language}
      >
        <AdminInput
          id={imageAltFieldId}
          value={topic[imageAltField]}
          disabled={disabled}
          onChange={(event) => onChange(imageAltField, event.target.value)}
        />
      </AdminTranslatableField>
    </div>
  );
}

export default ProjectTopicImagePanel;
