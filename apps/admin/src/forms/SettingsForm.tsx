import { useState } from "react";

import AdminButton from "@admin/components/ui/AdminButton";
import AdminExpandableSettingRow from "@admin/components/ui/AdminExpandableSettingRow";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { footerLinkDrafts, skillGroupDrafts } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettingsData,
} from "@admin/services/settingsContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";

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
  const nameHint = `Maksymalnie ${ADMIN_NAME_MAX_LENGTH} znaków.`;

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
    removeExpandedId(`group-${groupId}`);
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

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Ustawienia"
        description="Edytuj nazwy grup umiejętności, nazwy umiejętności oraz etykiety linków w stopce."
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
            <h3 className="text-lg font-bold">Nazwy grup umiejętności</h3>

            {settings.skillGroups.length === 0 ? (
              <p className="text-white/50">Brak grup umiejętności.</p>
            ) : (
              <div className="admin-stack">
                {settings.skillGroups.map((group) => {
                  const rowId = `group-${group.id}`;

                  return (
                    <AdminExpandableSettingRow
                      key={group.id}
                      title={group[titleField] || group.id}
                      isExpanded={expandedIds.has(rowId)}
                      disabled={isLoading || isSaving}
                      deleteLabel="Usuń grupę"
                      deleteDisabled={settings.skillGroups.length <= 1}
                      onDelete={() => deleteSkillGroup(group.id)}
                      onToggle={() =>
                        setExpandedIds((current) =>
                          toggleExpandedId(current, rowId),
                        )
                      }
                    >
                      <AdminTranslatableField
                        id={`settings-group-${group.id}`}
                        label="Nazwa grupy"
                        language={language}
                        hint={nameHint}
                      >
                        <AdminInput
                          id={`settings-group-${group.id}`}
                          maxLength={ADMIN_NAME_MAX_LENGTH}
                          value={group[titleField]}
                          disabled={isLoading}
                          onChange={(event) =>
                            updateGroupTitle(group.id, event.target.value)
                          }
                        />
                      </AdminTranslatableField>
                    </AdminExpandableSettingRow>
                  );
                })}
              </div>
            )}
          </div>

          <div className="admin-stack border-t border-white/10 pt-6">
            <h3 className="text-lg font-bold">Nazwy umiejętności</h3>

            {settings.skillGroups.every((group) => group.skills.length === 0) ? (
              <p className="text-white/50">Brak umiejętności do edycji.</p>
            ) : (
              <div className="admin-stack">
                {settings.skillGroups.flatMap((group) =>
                  group.skills.map((skill) => {
                    const rowId = `skill-${skill.id}`;

                    return (
                      <AdminExpandableSettingRow
                        key={skill.id}
                        title={`${group[titleField]} · ${skill.name}`}
                        isExpanded={expandedIds.has(rowId)}
                        disabled={isLoading || isSaving}
                        deleteLabel="Usuń umiejętność"
                        onDelete={() => deleteSkill(group.id, skill.id)}
                        onToggle={() =>
                          setExpandedIds((current) =>
                            toggleExpandedId(current, rowId),
                          )
                        }
                      >
                        <AdminField
                          id={`settings-skill-${skill.id}`}
                          label="Nazwa umiejętności"
                          hint={nameHint}
                        >
                          <AdminInput
                            id={`settings-skill-${skill.id}`}
                            maxLength={ADMIN_NAME_MAX_LENGTH}
                            value={skill.name}
                            disabled={isLoading}
                            onChange={(event) =>
                              updateSkillName(
                                group.id,
                                skill.id,
                                event.target.value,
                              )
                            }
                          />
                        </AdminField>
                      </AdminExpandableSettingRow>
                    );
                  }),
                )}
              </div>
            )}
          </div>

          <div className="admin-stack border-t border-white/10 pt-6">
            <h3 className="text-lg font-bold">Etykiety linków w stopce</h3>

            {settings.footerLinks.length === 0 ? (
              <p className="text-white/50">Brak linków w stopce.</p>
            ) : (
              <div className="admin-stack">
                {settings.footerLinks.map((link) => {
                  const rowId = `footer-${link.id}`;

                  return (
                    <AdminExpandableSettingRow
                      key={link.id}
                      title={link.label}
                      isExpanded={expandedIds.has(rowId)}
                      disabled={isLoading || isSaving}
                      deleteLabel="Usuń link"
                      deleteDisabled={settings.footerLinks.length <= 1}
                      onDelete={() => deleteFooterLink(link.id)}
                      onToggle={() =>
                        setExpandedIds((current) =>
                          toggleExpandedId(current, rowId),
                        )
                      }
                    >
                      <AdminField
                        id={`settings-footer-link-${link.id}`}
                        label="Etykieta linku"
                        hint={nameHint}
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
                    </AdminExpandableSettingRow>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AdminPanel>
    </section>
  );
}

export default SettingsForm;
