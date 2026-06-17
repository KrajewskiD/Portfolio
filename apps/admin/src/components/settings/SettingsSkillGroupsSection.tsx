import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminExpandableSettingRow from "@admin/components/ui/AdminExpandableSettingRow";
import AdminSortableList from "@admin/components/ui/AdminSortableList";
import SettingsSection from "@admin/components/settings/SettingsSection";
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
    <SettingsSection
      title="Nazwy grup umiejętności"
      description="Kliknij nazwę, aby edytować. Przeciągnij uchwyt, aby zmienić kolejność grup."
      action={
        <AdminAddButton
          label="Dodaj grupę"
          disabled={disabled}
          onClick={onAddGroup}
        />
      }
    >
      {skillGroups.length === 0 ? (
        <AdminEmptyMessage inline>
          Brak grup umiejętności. Kliknij +, aby dodać pierwszą grupę.
        </AdminEmptyMessage>
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
    </SettingsSection>
  );
}

export default SettingsSkillGroupsSection;
