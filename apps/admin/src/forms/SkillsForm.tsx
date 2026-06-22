import { useMemo, useState } from "react";

import SkillLevelsTable from "@admin/components/skills/SkillLevelsTable";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminEntitySelect from "@admin/components/ui/AdminEntitySelect";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import { skillGroupDrafts } from "@admin/data/adminDrafts";
import { patchSkillInGroups } from "@admin/forms/skillTranslatableFields";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  getAdminSkillGroups,
  saveAdminSkillGroups,
} from "@admin/services/skillContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import { normalizeSkillGroupIds } from "@shared/database";
import type { SkillGroupData } from "@shared/database/types/skill";
import { getLocalizedField } from "@shared/utils/localizedField";

function SkillsForm({ language }: AdminFormProps) {
  const {
    value: skillGroups,
    setValue: setSkillGroups,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminForm<SkillGroupData[]>({
    initialValue: skillGroupDrafts,
    loadValue: getAdminSkillGroups,
    saveValue: saveAdminSkillGroups,
    prepareBeforeSave: async (groups) => normalizeSkillGroupIds(groups),
  });

  const { isOverlayOpen } = useTranslationOverlay();

  const [activeGroupId, setActiveGroupId] = useState(
    skillGroupDrafts[0]?.id ?? "",
  );

  const activeGroup = useMemo(
    () =>
      skillGroups.find((group) => group.id === activeGroupId) ?? skillGroups[0],
    [activeGroupId, skillGroups],
  );

  const formDisabled = isLoading || isSaving || isOverlayOpen;

  function updateSkillLevel(skillId: string, level: number) {
    if (!activeGroup) {
      return;
    }

    setSkillGroups((current) =>
      patchSkillInGroups(current, activeGroup.id, skillId, "level", level),
    );
  }

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
            value={activeGroup.id}
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
