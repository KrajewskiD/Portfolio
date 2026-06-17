import { useState } from "react";

import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminButton from "@admin/components/ui/AdminButton";
import AdminExpandableSettingRow from "@admin/components/ui/AdminExpandableSettingRow";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminSortableList from "@admin/components/ui/AdminSortableList";
import { footerLinkDrafts, skillGroupDrafts } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettingsData,
} from "@admin/services/settingsContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";

function toggleExpandedId(expandedIds: Set<string>, id: string) {
  const next = new Set(expandedIds);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  return next;
}

function SettingsForm({ language }: AdminFormProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const {
    value: settings,
    setValue: setSettings,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminFormSave<AdminSettingsData>({
    initialValue: {
      skillGroups: skillGroupDrafts,
      footerLinks: footerLinkDrafts,
    },
    loadValue: getAdminSettings,
    saveValue: saveAdminSettings,
  });

  const titleField = language === "pl" ? "titlePl" : "titleEn";

  function addExpandedId(id: string) {
    setExpandedIds((current) => new Set(current).add(id));
  }

  function updateGroupTitle(groupId: string, value: string) {
    const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

    setSettings((current) => ({
      ...current,
      skillGroups: current.skillGroups.map((group) =>
        group.id === groupId ? { ...group, [titleField]: nextValue } : group,
      ),
    }));
  }

  function updateSkillName(groupId: string, skillId: string, value: string) {
    const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

    setSettings((current) => ({
      ...current,
      skillGroups: current.skillGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              skills: group.skills.map((skill) =>
                skill.id === skillId ? { ...skill, name: nextValue } : skill,
              ),
            }
          : group,
      ),
    }));
  }

  function updateFooterLabel(linkId: string, value: string) {
    const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

    setSettings((current) => ({
      ...current,
      footerLinks: current.footerLinks.map((link) =>
        link.id === linkId ? { ...link, label: nextValue } : link,
      ),
    }));
  }

  function updateFooterHref(linkId: string, value: string) {
    setSettings((current) => ({
      ...current,
      footerLinks: current.footerLinks.map((link) =>
        link.id === linkId ? { ...link, href: value } : link,
      ),
    }));
  }

  function removeExpandedId(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }

  function deleteSkillGroup(groupId: string) {
    if (settings.skillGroups.length <= 1) {
      return;
    }

    setSettings((current) => ({
      ...current,
      skillGroups: current.skillGroups.filter((group) => group.id !== groupId),
    }));
    removeExpandedId(`skills-group-${groupId}`);
  }

  function deleteSkill(groupId: string, skillId: string) {
    setSettings((current) => ({
      ...current,
      skillGroups: current.skillGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              skills: group.skills.filter((skill) => skill.id !== skillId),
            }
          : group,
      ),
    }));
    removeExpandedId(`skill-${skillId}`);
  }

  function deleteFooterLink(linkId: string) {
    if (settings.footerLinks.length <= 1) {
      return;
    }

    setSettings((current) => ({
      ...current,
      footerLinks: current.footerLinks.filter((link) => link.id !== linkId),
    }));
    removeExpandedId(`footer-${linkId}`);
  }

  function addSkillGroup() {
    const nextIndex = settings.skillGroups.length + 1;
    const nextId = `group-${String(nextIndex).padStart(2, "0")}`;

    setSettings((current) => ({
      ...current,
      skillGroups: [
        ...current.skillGroups,
        {
          id: nextId,
          titlePl: "Nowa grupa PL",
          titleEn: "New group EN",
          skills: [],
        },
      ],
    }));
  }

  function addSkillToGroup(groupId: string) {
    const targetGroup = settings.skillGroups.find(
      (group) => group.id === groupId,
    );

    if (!targetGroup) {
      return;
    }

    const nextIndex = targetGroup.skills.length + 1;
    const nextId = `${groupId}-skill-${String(nextIndex).padStart(2, "0")}`;

    const nextSkill: Skill = {
      id: nextId,
      name: "Nowa umiejętność",
      level: 1,
      descriptionPl: "",
      descriptionEn: "",
    };

    setSettings((current) => ({
      ...current,
      skillGroups: current.skillGroups.map((group) =>
        group.id === groupId
          ? { ...group, skills: [...group.skills, nextSkill] }
          : group,
      ),
    }));
    addExpandedId(`skills-group-${groupId}`);
  }

  function addFooterLink() {
    const nextIndex = settings.footerLinks.length + 1;
    const nextId = `link-${String(nextIndex).padStart(2, "0")}`;

    const nextLink: FooterLinkData = {
      id: nextId,
      label: "Nowy link",
      href: "#",
      displayOrder: nextIndex,
    };

    setSettings((current) => ({
      ...current,
      footerLinks: [...current.footerLinks, nextLink],
    }));
    addExpandedId(`footer-${nextId}`);
  }

  function reorderSkillGroups(nextGroups: SkillGroupData[]) {
    setSettings((current) => ({
      ...current,
      skillGroups: nextGroups,
    }));
  }

  function reorderSkillsInGroup(groupId: string, nextSkills: Skill[]) {
    setSettings((current) => ({
      ...current,
      skillGroups: current.skillGroups.map((group) =>
        group.id === groupId ? { ...group, skills: nextSkills } : group,
      ),
    }));
  }

  function reorderFooterLinks(nextLinks: FooterLinkData[]) {
    setSettings((current) => ({
      ...current,
      footerLinks: nextLinks,
    }));
  }

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Ustawienia"
        description="Edytuj nazwy grup umiejętności, nazwy umiejętności oraz linki w stopce."
        actions={
          <AdminFormActions>
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

        <div className="admin-stack">
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
                disabled={isLoading || isSaving}
                onClick={addSkillGroup}
              />
            </div>

            {settings.skillGroups.length === 0 ? (
              <p className="text-white/50">
                Brak grup umiejętności. Kliknij +, aby dodać pierwszą grupę.
              </p>
            ) : (
              <AdminSortableList
                items={settings.skillGroups}
                getItemId={(group) => group.id}
                disabled={isLoading || isSaving}
                onReorder={reorderSkillGroups}
              >
                {(group, dragHandle) => (
                  <AdminExpandableSettingRow
                    editableTitle={{
                      id: `settings-group-${group.id}`,
                      value: group[titleField],
                      maxLength: ADMIN_NAME_MAX_LENGTH,
                      placeholder: group.id,
                      onChange: (value) => updateGroupTitle(group.id, value),
                    }}
                    disabled={isLoading || isSaving}
                    dragHandle={dragHandle}
                    deleteLabel="Usuń grupę"
                    deleteDisabled={settings.skillGroups.length <= 1}
                    onDelete={() => deleteSkillGroup(group.id)}
                  />
                )}
              </AdminSortableList>
            )}
          </div>

          <div className="admin-stack border-t border-white/10 pt-6">
            <div className="admin-stack">
              <h3 className="text-lg font-bold">Nazwy umiejętności</h3>
              <p className="text-sm text-white/40">
                Kliknij nazwę, aby edytować. Rozwiń grupę, aby zarządzać
                umiejętnościami.
              </p>
            </div>

            {settings.skillGroups.length === 0 ? (
              <p className="text-white/50">
                Najpierw dodaj grupę umiejętności.
              </p>
            ) : (
              <div className="admin-stack">
                {settings.skillGroups.map((group) => {
                  const groupRowId = `skills-group-${group.id}`;

                  return (
                    <AdminExpandableSettingRow
                      key={group.id}
                      editableTitle={{
                        id: `settings-skills-group-${group.id}`,
                        value: group[titleField],
                        maxLength: ADMIN_NAME_MAX_LENGTH,
                        placeholder: group.id,
                        onChange: (value) => updateGroupTitle(group.id, value),
                      }}
                      isExpanded={expandedIds.has(groupRowId)}
                      disabled={isLoading || isSaving}
                      onToggle={() =>
                        setExpandedIds((current) =>
                          toggleExpandedId(current, groupRowId),
                        )
                      }
                    >
                      <div className="admin-stack">
                        {group.skills.length === 0 ? (
                          <p className="text-white/50">
                            Brak umiejętności w tej grupie.
                          </p>
                        ) : (
                          <AdminSortableList
                            items={group.skills}
                            getItemId={(skill) => skill.id}
                            disabled={isLoading || isSaving}
                            onReorder={(nextSkills) =>
                              reorderSkillsInGroup(group.id, nextSkills)
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
                                    updateSkillName(group.id, skill.id, value),
                                }}
                                disabled={isLoading || isSaving}
                                dragHandle={dragHandle}
                                deleteLabel="Usuń umiejętność"
                                onDelete={() => deleteSkill(group.id, skill.id)}
                              />
                            )}
                          </AdminSortableList>
                        )}

                        <div className="flex justify-end">
                          <AdminAddButton
                            label="Dodaj umiejętność"
                            disabled={isLoading || isSaving}
                            onClick={() => addSkillToGroup(group.id)}
                          />
                        </div>
                      </div>
                    </AdminExpandableSettingRow>
                  );
                })}
              </div>
            )}
          </div>

          <div className="admin-stack border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="admin-stack">
                <h3 className="text-lg font-bold">Linki w stopce</h3>
                <p className="text-sm text-white/40">
                  Przeciągnij uchwyt, aby zmienić kolejność linków.
                </p>
              </div>
              <AdminAddButton
                label="Dodaj link"
                disabled={isLoading || isSaving}
                onClick={addFooterLink}
              />
            </div>

            {settings.footerLinks.length === 0 ? (
              <p className="text-white/50">
                Brak linków w stopce. Kliknij +, aby dodać pierwszy link.
              </p>
            ) : (
              <AdminSortableList
                items={settings.footerLinks}
                getItemId={(link) => link.id}
                disabled={isLoading || isSaving}
                onReorder={reorderFooterLinks}
              >
                {(link, dragHandle) => {
                  const rowId = `footer-${link.id}`;

                  return (
                    <AdminExpandableSettingRow
                      title={link.label}
                      isExpanded={expandedIds.has(rowId)}
                      disabled={isLoading || isSaving}
                      dragHandle={dragHandle}
                      deleteLabel="Usuń link"
                      deleteDisabled={settings.footerLinks.length <= 1}
                      onDelete={() => deleteFooterLink(link.id)}
                      onToggle={() =>
                        setExpandedIds((current) =>
                          toggleExpandedId(current, rowId),
                        )
                      }
                    >
                      <div className="admin-stack">
                        <AdminField
                          id={`settings-footer-link-${link.id}`}
                          label="Etykieta linku"
                          hint={`Maksymalnie ${ADMIN_NAME_MAX_LENGTH} znaków.`}
                        >
                          <AdminInput
                            id={`settings-footer-link-${link.id}`}
                            maxLength={ADMIN_NAME_MAX_LENGTH}
                            value={link.label}
                            disabled={isLoading}
                            onChange={(event) =>
                              updateFooterLabel(link.id, event.target.value)
                            }
                          />
                        </AdminField>

                        <AdminField
                          id={`settings-footer-link-href-${link.id}`}
                          label="Adres URL"
                        >
                          <AdminInput
                            id={`settings-footer-link-href-${link.id}`}
                            type="url"
                            value={link.href}
                            disabled={isLoading}
                            onChange={(event) =>
                              updateFooterHref(link.id, event.target.value)
                            }
                          />
                        </AdminField>
                      </div>
                    </AdminExpandableSettingRow>
                  );
                }}
              </AdminSortableList>
            )}
          </div>
        </div>
      </AdminPanel>
    </section>
  );
}

export default SettingsForm;
