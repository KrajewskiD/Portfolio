import { useMemo, useState } from "react";

import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminEntitySelect from "@admin/components/ui/AdminEntitySelect";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import AdminInput from "@admin/components/ui/AdminInput";
import { skillGroupDrafts } from "@admin/data/adminDrafts";
import { patchSkillInGroups } from "@admin/forms/skillTranslatableFields";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
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

      {activeGroup.skills.length === 0 ? (
        <AdminEmptyMessage inline>
          Brak umiejętności w tej grupie. Dodaj je w Ustawieniach.
        </AdminEmptyMessage>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white/45 uppercase">
            <span>Umiejętność</span>
            <span className="w-16 text-center">Poziom</span>
          </div>

          {activeGroup.skills.map((skill) => (
            <div
              key={skill.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-white/10 px-4 py-3 first:border-t-0"
            >
              <span className="min-w-0 truncate font-bold text-white">
                {skill.name}
              </span>

              <AdminInput
                id={`skill-level-${skill.id}`}
                type="number"
                min={1}
                max={5}
                aria-label={`Poziom: ${skill.name}`}
                className="admin-control-compact admin-control-compact--level w-16 text-center"
                value={skill.level}
                disabled={isLoading}
                onChange={(event) =>
                  updateSkillLevel(skill.id, Number(event.target.value))
                }
              />
            </div>
          ))}
        </div>
      )}
    </AdminFormShell>
  );
}

export default SkillsForm;
