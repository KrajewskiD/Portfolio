import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminField from "@admin/components/ui/AdminField";
import AdminInput from "@admin/components/ui/AdminInput";
import type { ProjectTechnology } from "@shared/database/types/project";

type ProjectTechnologyField = keyof ProjectTechnology;

type ProjectTechnologiesFieldProps = {
  id: string;
  technologies: ProjectTechnology[];
  disabled?: boolean;
  onAdd: () => void;
  onUpdate: (
    index: number,
    field: ProjectTechnologyField,
    value: string,
  ) => void;
  onRemove: (index: number) => void;
};

function ProjectTechnologiesField({
  id,
  technologies,
  disabled = false,
  onAdd,
  onUpdate,
  onRemove,
}: ProjectTechnologiesFieldProps) {
  return (
    <AdminField
      id={id}
      label="Technologie"
      hint="Dodaj technologię przyciskiem +. Icon slug w formacie prefix/nazwa, np. mdi/unity lub logos/react."
      action={
        <AdminAddButton
          label="Dodaj technologię"
          disabled={disabled}
          onClick={onAdd}
        />
      }
    >
      {technologies.length === 0 ? (
        <AdminEmptyMessage inline>
          Brak technologii. Kliknij +, aby dodać pierwszą pozycję.
        </AdminEmptyMessage>
      ) : (
        <div className="admin-stack">
          {technologies.map((technology, index) => (
            <div key={`${id}-${index}`} className="admin-technology-row">
              <AdminInput
                id={`${id}-name-${index}`}
                className="admin-technology-row__input"
                value={technology.name}
                placeholder="Nazwa technologii"
                disabled={disabled}
                onChange={(event) =>
                  onUpdate(index, "name", event.target.value)
                }
              />

              <AdminInput
                id={`${id}-slug-${index}`}
                className="admin-technology-row__input"
                value={technology.iconSlug}
                placeholder="np. mdi/unity"
                disabled={disabled}
                onChange={(event) =>
                  onUpdate(index, "iconSlug", event.target.value)
                }
              />

              <AdminDeleteButton
                label="Usuń technologię"
                disabled={disabled}
                onClick={() => onRemove(index)}
              />
            </div>
          ))}
        </div>
      )}
    </AdminField>
  );
}

export default ProjectTechnologiesField;
