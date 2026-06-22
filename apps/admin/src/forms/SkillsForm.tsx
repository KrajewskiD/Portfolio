import SkillLevelsTable from "@admin/components/skills/SkillLevelsTable";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminEntitySelect from "@admin/components/ui/AdminEntitySelect";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import { useSkillsForm } from "@admin/forms/skills/useSkillsForm";
import type { AdminFormProps } from "@admin/types/adminForms";
import { getLocalizedField } from "@shared/utils/localizedField";

function SkillsForm({ language }: AdminFormProps) {
  const {
    skillGroups,
    activeGroup,
    activeGroupId,
    setActiveGroupId,
    updateSkillLevel,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
    formDisabled,
  } = useSkillsForm();

  if (!activeGroup) {
    return null;
  }

  return (
    <AdminFormShell
      title="Umiejętności"
      description="Edytuj poziomy umiejętności w wybranej grupie. Nazwy ustawiasz w Ustawieniach."
      panelCompact
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      actions={
        <AdminFormActions>
          <AdminEntitySelect
            id="skill-group-select"
            ariaLabel="Grupa umiejętności"
            className="w-80 max-w-full"
            value={activeGroupId}
            disabled={isLoading}
            items={skillGroups}
            getItemId={(group) => group.id}
            getItemLabel={(group) =>
              getLocalizedField(group, language, "titlePl", "titleEn")
            }
            onChange={setActiveGroupId}
          />
          <AdminFormSaveActions
            language={language}
            saveDisabled={formDisabled}
            isSaving={isSaving}
            onSave={save}
          />
        </AdminFormActions>
      }
    >
      <AdminEditLanguageBanner language={language} />

      <h3 className="admin-section-title">Umiejętności w grupie</h3>

      <SkillLevelsTable
        skills={activeGroup.skills}
        disabled={isLoading}
        onLevelChange={updateSkillLevel}
      />
    </AdminFormShell>
  );
}

export default SkillsForm;
