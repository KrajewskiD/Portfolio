import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminExpandableSettingRow from "@admin/components/ui/AdminExpandableSettingRow";
import AdminSortableList from "@admin/components/ui/AdminSortableList";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { SkillGroupData } from "@shared/database/types/skill";

type SettingsSkillGroupsSectionProps = {
  skillGroups: SkillGroupData[];
  titleField: "titlePl" | "titleEn";
  disabled: boolean;
  onAddGroup: () => void;
  onReorder: (groups: SkillGroupData[]) => void;
  onUpdateTitle: (groupId: string, value: string) => void;
  onDeleteGroup: (groupId: string) => void;
};

function SettingsSkillGroupsSection({
  skillGroups,
  titleField,
  disabled,
  onAddGroup,
  onReorder,
  onUpdateTitle,
  onDeleteGroup,
}: SettingsSkillGroupsSectionProps) {
  return (
    <div className="admin-stack">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="admin-stack">
          <h3 className="text-lg font-bold">Nazwy grup umiejętności</h3>
          <p className="text-sm text-white/40">
            Kliknij nazwę, aby edytować. Przeciągnij uchwyt, aby zmienić
            kolejność grup.
          </p>
        </div>
        <AdminAddButton
          label="Dodaj grupę"
          disabled={disabled}
          onClick={onAddGroup}
        />
      </div>

      {skillGroups.length === 0 ? (
        <p className="text-white/50">
          Brak grup umiejętności. Kliknij +, aby dodać pierwszą grupę.
        </p>
      ) : (
        <AdminSortableList
          items={skillGroups}
          getItemId={(group) => group.id}
          disabled={disabled}
          onReorder={onReorder}
        >
          {(group, dragHandle) => (
            <AdminExpandableSettingRow
              editableTitle={{
                id: `settings-group-${group.id}`,
                value: group[titleField],
                maxLength: ADMIN_NAME_MAX_LENGTH,
                placeholder: group.id,
                onChange: (value) => onUpdateTitle(group.id, value),
              }}
              disabled={disabled}
              dragHandle={dragHandle}
              deleteLabel="Usuń grupę"
              onDelete={() => onDeleteGroup(group.id)}
            />
          )}
        </AdminSortableList>
      )}
    </div>
  );
}

export default SettingsSkillGroupsSection;
