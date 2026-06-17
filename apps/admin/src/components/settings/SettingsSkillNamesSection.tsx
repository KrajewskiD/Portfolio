import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminExpandableSettingRow from "@admin/components/ui/AdminExpandableSettingRow";
import AdminSortableList from "@admin/components/ui/AdminSortableList";
import SettingsSection from "@admin/components/settings/SettingsSection";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";

type SettingsSkillNamesSectionProps = {
  skillGroups: SkillGroupData[];
  titleField: "titlePl" | "titleEn";
  expandedIds: Set<string>;
  disabled: boolean;
  onToggleGroup: (groupRowId: string) => void;
  onUpdateGroupTitle: (groupId: string, value: string) => void;
  onUpdateSkillName: (groupId: string, skillId: string, value: string) => void;
  onReorderSkills: (groupId: string, skills: Skill[]) => void;
  onDeleteSkill: (groupId: string, skillId: string) => void;
  onAddSkill: (groupId: string) => void;
};

function SettingsSkillNamesSection({
  skillGroups,
  titleField,
  expandedIds,
  disabled,
  onToggleGroup,
  onUpdateGroupTitle,
  onUpdateSkillName,
  onReorderSkills,
  onDeleteSkill,
  onAddSkill,
}: SettingsSkillNamesSectionProps) {
  return (
    <SettingsSection
      bordered
      title="Nazwy umiejętności"
      description="Kliknij nazwę, aby edytować. Rozwiń grupę, aby zarządzać umiejętnościami."
    >
      {skillGroups.length === 0 ? (
        <AdminEmptyMessage inline>
          Najpierw dodaj grupę umiejętności.
        </AdminEmptyMessage>
      ) : (
        <div className="admin-stack">
          {skillGroups.map((group) => {
            const groupRowId = `skills-group-${group.id}`;

            return (
              <AdminExpandableSettingRow
                key={group.id}
                editableTitle={{
                  id: `settings-skills-group-${group.id}`,
                  value: group[titleField],
                  maxLength: ADMIN_NAME_MAX_LENGTH,
                  placeholder: group.id,
                  onChange: (value) => onUpdateGroupTitle(group.id, value),
                }}
                isExpanded={expandedIds.has(groupRowId)}
                disabled={disabled}
                onToggle={() => onToggleGroup(groupRowId)}
              >
                <div className="admin-stack">
                  {group.skills.length === 0 ? (
                    <AdminEmptyMessage inline>
                      Brak umiejętności w tej grupie.
                    </AdminEmptyMessage>
                  ) : (
                    <AdminSortableList
                      items={group.skills}
                      getItemId={(skill) => skill.id}
                      disabled={disabled}
                      onReorder={(nextSkills) =>
                        onReorderSkills(group.id, nextSkills)
                      }
                    >
                      {(skill, dragHandle) => (
                        <AdminExpandableSettingRow
                          nested
                          editableTitle={{
                            id: `settings-skill-${skill.id}`,
                            value: skill.name,
                            maxLength: ADMIN_NAME_MAX_LENGTH,
                            placeholder: "Nowa umiejętność",
                            onChange: (value) =>
                              onUpdateSkillName(group.id, skill.id, value),
                          }}
                          disabled={disabled}
                          dragHandle={dragHandle}
                          deleteLabel="Usuń umiejętność"
                          onDelete={() => onDeleteSkill(group.id, skill.id)}
                        />
                      )}
                    </AdminSortableList>
                  )}

                  <div className="flex justify-end">
                    <AdminAddButton
                      label="Dodaj umiejętność"
                      disabled={disabled}
                      onClick={() => onAddSkill(group.id)}
                    />
                  </div>
                </div>
              </AdminExpandableSettingRow>
            );
          })}
        </div>
      )}
    </SettingsSection>
  );
}

export default SettingsSkillNamesSection;
