import { useMemo, useState } from "react";

import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminButton from "@admin/components/ui/AdminButton";
import AdminCustomSelect from "@admin/components/ui/AdminCustomSelect";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminTextarea from "@admin/components/ui/AdminTextarea";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { skillGroupDrafts } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import {
  getAdminSkillGroups,
  saveAdminSkillGroups,
} from "@admin/services/skillContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import { SKILL_GROUP_TITLE_MAX_LENGTH } from "@shared/constants/skill";
import type { Skill, SkillGroupData } from "@shared/types/skill";

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
  } = useAdminFormSave<SkillGroupData[]>({
    initialValue: skillGroupDrafts,
    loadValue: getAdminSkillGroups,
    saveValue: saveAdminSkillGroups,
  });

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

  const titleField = language === "pl" ? "titlePl" : "titleEn";
  const descriptionField =
    language === "pl" ? "descriptionPl" : "descriptionEn";

  function updateActiveGroup(field: "titlePl" | "titleEn", value: string) {
    const nextValue = value.slice(0, SKILL_GROUP_TITLE_MAX_LENGTH);

    setSkillGroups((current) =>
      current.map((group) =>
        group.id === activeGroup.id ? { ...group, [field]: nextValue } : group,
      ),
    );
  }

  function updateActiveSkill(
    field: keyof Pick<
      Skill,
      "name" | "level" | "descriptionPl" | "descriptionEn"
    >,
    value: string | number,
  ) {
    setSkillGroups((current) =>
      current.map((group) =>
        group.id === activeGroup.id
          ? {
              ...group,
              skills: group.skills.map((skill) =>
                skill.id === activeSkill.id
                  ? { ...skill, [field]: value }
                  : skill,
              ),
            }
          : group,
      ),
    );
  }

  function addSkillGroup() {
    const nextIndex = skillGroups.length + 1;
    const nextId = `group-${String(nextIndex).padStart(2, "0")}`;

    const nextGroup: SkillGroupData = {
      id: nextId,
      titlePl: "Nowa grupa PL",
      titleEn: "New group EN",
      skills: [],
    };

    setSkillGroups((current) => [...current, nextGroup]);
    setActiveGroupId(nextId);
    setActiveSkillId("");
  }

  function deleteSkillGroup() {
    if (skillGroups.length <= 1) {
      return;
    }

    const remainingGroups = skillGroups.filter(
      (group) => group.id !== activeGroup.id,
    );

    setSkillGroups(remainingGroups);
    setActiveGroupId(remainingGroups[0]?.id ?? "");
    setActiveSkillId(remainingGroups[0]?.skills[0]?.id ?? "");
  }

  function addSkill() {
    const nextIndex = activeGroup.skills.length + 1;
    const nextId = `${activeGroup.id}-skill-${String(nextIndex).padStart(2, "0")}`;

    const nextSkill: Skill = {
      id: nextId,
      name: "Nowa umiejętność",
      level: 1,
      descriptionPl: "",
      descriptionEn: "",
    };

    setSkillGroups((current) =>
      current.map((group) =>
        group.id === activeGroup.id
          ? { ...group, skills: [...group.skills, nextSkill] }
          : group,
      ),
    );
    setActiveSkillId(nextId);
  }

  function deleteSkill() {
    if (!activeSkill) {
      return;
    }

    const remainingSkills = activeGroup.skills.filter(
      (skill) => skill.id !== activeSkill.id,
    );

    setSkillGroups((current) =>
      current.map((group) =>
        group.id === activeGroup.id
          ? { ...group, skills: remainingSkills }
          : group,
      ),
    );
    setActiveSkillId(remainingSkills[0]?.id ?? "");
  }

  if (!activeGroup) {
    return null;
  }

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Umiejętności"
        description="Edytuj grupy umiejętności technicznych oraz poziomy i opisy poszczególnych pozycji."
        actions={
          <AdminFormActions>
            <AdminCustomSelect
              id="skill-group-select"
              ariaLabel="Grupa umiejętności"
              className="w-80 max-w-full"
              value={activeGroup.id}
              disabled={isLoading}
              options={skillGroups.map((group) => ({
                value: group.id,
                label: group[titleField],
              }))}
              onChange={(groupId) => {
                const group = skillGroups.find((item) => item.id === groupId);

                setActiveGroupId(groupId);
                setActiveSkillId(group?.skills[0]?.id ?? "");
              }}
            />
            <AdminDeleteButton
              label="Usuń grupę"
              disabled={isLoading || isSaving || skillGroups.length <= 1}
              onClick={deleteSkillGroup}
            />
            <AdminAddButton label="Dodaj grupę" onClick={addSkillGroup} />
            <AdminButton
              type="button"
              variant="secondary"
              disabled={isLoading || isSaving}
              onClick={() => void save()}
            >
              {isSaving ? "Zapisywanie..." : "Zapisz"}
            </AdminButton>
          </AdminFormActions>
        }
      />

      {loadError ? (
        <p role="status" className="text-sm text-amber-300">
          {loadError}
        </p>
      ) : null}

      {saveError ? (
        <p role="alert" className="text-sm text-red-300">
          {saveError}
        </p>
      ) : null}

      {saveSuccess ? (
        <p role="status" className="text-sm text-emerald-300">
          Zmiany zostały zapisane.
        </p>
      ) : null}

      <AdminPanel>
        <p className="font-mono text-sm font-bold text-white/35">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <AdminTranslatableField
          id="skill-group-title"
          label="Nazwa grupy"
          language={language}
          hint={`Maksymalnie ${SKILL_GROUP_TITLE_MAX_LENGTH} znaków.`}
        >
          <AdminInput
            id="skill-group-title"
            maxLength={SKILL_GROUP_TITLE_MAX_LENGTH}
            value={activeGroup[titleField]}
            disabled={isLoading}
            onChange={(event) =>
              updateActiveGroup(titleField, event.target.value)
            }
          />
        </AdminTranslatableField>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <h3 className="text-lg font-bold">Umiejętności w grupie</h3>
          <AdminAddButton label="Dodaj umiejętność" onClick={addSkill} />
        </div>

        {activeGroup.skills.length === 0 ? (
          <p className="text-white/50">
            Brak umiejętności w tej grupie. Dodaj pierwszą pozycję.
          </p>
        ) : activeSkill ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <AdminField id="skill-select" label="Umiejętność">
                  <AdminCustomSelect
                    id="skill-select"
                    value={activeSkill.id}
                    disabled={isLoading}
                    options={activeGroup.skills.map((skill) => ({
                      value: skill.id,
                      label: skill.name,
                    }))}
                    onChange={setActiveSkillId}
                  />
                </AdminField>
              </div>

              <AdminDeleteButton
                label="Usuń umiejętność"
                disabled={isLoading || isSaving}
                onClick={deleteSkill}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <AdminField id="skill-name" label="Nazwa">
                <AdminInput
                  id="skill-name"
                  value={activeSkill.name}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateActiveSkill("name", event.target.value)
                  }
                />
              </AdminField>

              <AdminField id="skill-level" label="Poziom (1–5)">
                <AdminInput
                  id="skill-level"
                  type="number"
                  min={1}
                  max={5}
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
            >
              <AdminTextarea
                id="skill-description"
                rows={4}
                value={activeSkill[descriptionField]}
                disabled={isLoading}
                onChange={(event) =>
                  updateActiveSkill(descriptionField, event.target.value)
                }
              />
            </AdminTranslatableField>
          </>
        ) : null}
      </AdminPanel>
    </section>
  );
}

export default SkillsForm;
