import { useCallback, useMemo, useState } from "react";

import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminEntitySelect from "@admin/components/ui/AdminEntitySelect";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { skillGroupDrafts } from "@admin/data/adminDrafts";
import {
  createActiveGroupSkillTranslateFields,
  patchSkillInGroups,
} from "@admin/forms/skillTranslatableFields";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
import {
  getAdminSkillGroups,
  saveAdminSkillGroups,
} from "@admin/services/skillContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import { normalizeSkillGroupIds } from "@shared/database";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";
import {
  getLocalizedField,
  getLocalizedKey,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

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
  const [activeSkillId, setActiveSkillId] = useState(
    skillGroupDrafts[0]?.skills[0]?.id ?? "",
  );

  const activeGroup = useMemo(
    () =>
      skillGroups.find((group) => group.id === activeGroupId) ?? skillGroups[0],
    [activeGroupId, skillGroups],
  );

  const activeSkill = useMemo(
    () =>
      activeGroup?.skills.find((skill) => skill.id === activeSkillId) ??
      activeGroup?.skills[0],
    [activeGroup, activeSkillId],
  );

  const formDisabled = isLoading || isSaving || isOverlayOpen;

  const applySkillDescription = useCallback(
    (
      skillId: string,
      field: "descriptionPl" | "descriptionEn",
      text: string,
    ) => {
      if (!activeGroup) {
        return;
      }

      setSkillGroups((current) =>
        patchSkillInGroups(current, activeGroup.id, skillId, field, text),
      );
    },
    [activeGroup, setSkillGroups],
  );

  const bulkTranslateFields = useMemo(
    () =>
      activeGroup
        ? createActiveGroupSkillTranslateFields(
            activeGroup,
            language,
            applySkillDescription,
          )
        : [],
    [activeGroup, applySkillDescription, language],
  );

  const bulkTranslate = useTranslateFields({
    language,
    disabled: formDisabled || !activeGroup || activeGroup.skills.length === 0,
    fields: bulkTranslateFields,
  });

  function updateActiveSkill(
    field: keyof Pick<Skill, "level" | "descriptionPl" | "descriptionEn">,
    value: string | number,
  ) {
    if (!activeGroup || !activeSkill) {
      return;
    }

    setSkillGroups((current) =>
      patchSkillInGroups(current, activeGroup.id, activeSkill.id, field, value),
    );
  }

  if (!activeGroup) {
    return null;
  }

  return (
    <AdminFormShell
      title="Umiejętności"
      description="Edytuj grupy umiejętności technicznych oraz poziomy i opisy poszczególnych pozycji."
      panelCompact
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      extraErrors={bulkTranslate.error ? [bulkTranslate.error] : []}
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
            onChange={(groupId) => {
              const group = skillGroups.find((item) => item.id === groupId);

              setActiveGroupId(groupId);
              setActiveSkillId(group?.skills[0]?.id ?? "");
            }}
          />
          <AdminFormSaveActions
            language={language}
            saveDisabled={formDisabled}
            isSaving={isSaving}
            onSave={save}
            translateDisabled={formDisabled || activeGroup.skills.length === 0}
            isBulkTranslating={bulkTranslate.isTranslating}
            translateTitle="Przetłumacz opisy umiejętności w grupie przez Gemini AI"
            onTranslateAll={bulkTranslate.onTranslateAll}
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
      ) : activeSkill ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <AdminField
              id="skill-select"
              label="Umiejętność"
              className="admin-field--compact min-w-0 sm:w-1/4"
            >
              <AdminEntitySelect
                id="skill-select"
                ariaLabel="Umiejętność"
                compact
                value={activeSkill.id}
                disabled={isLoading}
                items={activeGroup.skills}
                getItemId={(skill) => skill.id}
                getItemLabel={(skill) => skill.name}
                onChange={setActiveSkillId}
              />
            </AdminField>

            <AdminField
              id="skill-level"
              label="Poziom"
              className="admin-field--compact w-full shrink-0 sm:w-[12.5%] sm:min-w-[3.75rem] sm:max-w-[4.5rem]"
            >
              <AdminInput
                id="skill-level"
                type="number"
                min={1}
                max={5}
                className="admin-control-compact admin-control-compact--level text-center"
                value={activeSkill.level}
                disabled={isLoading}
                onChange={(event) =>
                  updateActiveSkill("level", Number(event.target.value))
                }
              />
            </AdminField>
          </div>

          <AdminTranslatableField
            id="skill-description"
            label="Opis"
            language={language}
            className="admin-field--compact"
            disabled={formDisabled || !activeSkill}
            sourceText={getLocalizedField(
              activeSkill,
              language,
              "descriptionPl",
              "descriptionEn",
            )}
            onApply={(text) =>
              updateActiveSkill(
                getOppositeLocalizedKey(
                  language,
                  "descriptionPl",
                  "descriptionEn",
                ),
                text,
              )
            }
          >
            <AdminTextarea
              id="skill-description"
              rows={2}
              className="admin-textarea-compact admin-control-compact"
              value={getLocalizedField(
                activeSkill,
                language,
                "descriptionPl",
                "descriptionEn",
              )}
              disabled={isLoading}
              onChange={(event) =>
                updateActiveSkill(
                  getLocalizedKey(language, "descriptionPl", "descriptionEn"),
                  event.target.value,
                )
              }
            />
          </AdminTranslatableField>
        </div>
      ) : null}
    </AdminFormShell>
  );
}

export default SkillsForm;
