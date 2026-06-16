import AdminField from "@admin/components/ui/AdminField";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminTranslateButton from "@admin/components/ui/AdminTranslateButton";
import { projectTopicLabels } from "@shared/constants/projectTopics";
import type { Language } from "@shared/types/language";
import type { ProjectTopicContent } from "@shared/types/project";

export type ProjectTopicImageField = "imageUrl" | "imageAltPl" | "imageAltEn";

type ProjectTopicImagePanelProps = {
  topic: ProjectTopicContent;
  language: Language;
  onChange: (field: ProjectTopicImageField, value: string) => void;
};

function ProjectTopicImagePanel({
  topic,
  language,
  onChange,
}: ProjectTopicImagePanelProps) {
  const imageAltField = language === "pl" ? "imageAltPl" : "imageAltEn";
  const topicLabel = projectTopicLabels[topic.id][language];

  return (
    <div className="space-y-6">
      <AdminField id="project-image-url" label={`Zdjęcie: ${topicLabel}`}>
        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-neutral-900 text-center text-white/40">
          {topic.imageUrl ? (
            <img
              src={topic.imageUrl}
              alt={topic[imageAltField]}
              className="h-full max-h-80 w-full rounded-3xl object-cover"
            />
          ) : (
            <span>Brak zdjęcia dla tej zakładki</span>
          )}
        </div>

        <AdminInput
          id="project-image-url"
          value={topic.imageUrl ?? ""}
          onChange={(event) => onChange("imageUrl", event.target.value)}
        />
      </AdminField>

      <AdminField
        id="project-image-alt"
        label="Opis alternatywny zdjęcia"
        action={<AdminTranslateButton language={language} />}
      >
        <AdminInput
          id="project-image-alt"
          value={topic[imageAltField]}
          onChange={(event) => onChange(imageAltField, event.target.value)}
        />
      </AdminField>
    </div>
  );
}

export default ProjectTopicImagePanel;