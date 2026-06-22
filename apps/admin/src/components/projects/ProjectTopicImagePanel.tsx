import AdminImagePicker from "@admin/components/ui/AdminImagePicker";
import { AdminLocalizedInput } from "@admin/components/ui/AdminLocalizedField";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type { ProjectTopicContent } from "@shared/database/types/project";
import type { ProjectTopicImageField } from "@admin/forms/projects/projectEditorTypes";
import { getLocalizedField } from "@shared/utils/localizedField";

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
  const topicLabel = projectTopicLabels[topic.id][language];
  const imageAltFieldId = `${topic.id}-image-alt`;

  return (
    <div className="admin-image-column admin-image-column--fluid">
      <AdminImagePicker
        label={`Zdjęcie: ${topicLabel}`}
        imageUrl={topic.imageUrl}
        selectedFile={selectedFile}
        imageMarkedForRemoval={imageMarkedForRemoval}
        previewAlt={getLocalizedField(
          topic,
          language,
          "imageAltPl",
          "imageAltEn",
        )}
        emptyLabel="Brak zdjęcia dla tej zakładki"
        disabled={disabled}
        onFileSelect={onFileSelect}
        onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
      />

      <AdminLocalizedInput
        id={imageAltFieldId}
        label="Opis alternatywny zdjęcia"
        language={language}
        disabled={disabled}
        source={topic}
        plKey="imageAltPl"
        enKey="imageAltEn"
        onChange={onChange}
      />
    </div>
  );
}

export default ProjectTopicImagePanel;
