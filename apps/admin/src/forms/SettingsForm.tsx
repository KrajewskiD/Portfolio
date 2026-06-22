import SettingsFooterLinksSection from "@admin/components/settings/SettingsFooterLinksSection";
import SettingsSkillGroupsSection from "@admin/components/settings/SettingsSkillGroupsSection";
import SettingsSkillNamesSection from "@admin/components/settings/SettingsSkillNamesSection";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import AdminSaveButton from "@admin/components/ui/AdminSaveButton";
import { useSettingsForm } from "@admin/forms/settings/useSettingsForm";
import type { AdminFormProps } from "@admin/types/adminForms";

function SettingsForm({ language }: AdminFormProps) {
  const {
    settings,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
    formDisabled,
    editor,
  } = useSettingsForm(language);

  return (
    <AdminFormShell
      title="Ustawienia"
      description="Edytuj nazwy grup umiejętności, nazwy umiejętności oraz linki w stopce."
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      actions={
        <AdminFormActions>
          <AdminSaveButton
            disabled={formDisabled}
            isSaving={isSaving}
            onSave={save}
          />
        </AdminFormActions>
      }
    >
      <AdminEditLanguageBanner language={language} />

      <div className="admin-stack">
        <SettingsSkillGroupsSection
          skillGroups={settings.skillGroups}
          titleField={editor.titleField}
          disabled={formDisabled}
          onAddGroup={editor.addSkillGroup}
          onReorder={editor.reorderSkillGroups}
          onUpdateTitle={editor.updateGroupTitle}
          onDeleteGroup={editor.deleteSkillGroup}
        />

        <SettingsSkillNamesSection
          skillGroups={settings.skillGroups}
          titleField={editor.titleField}
          expandedIds={editor.expandedIds}
          disabled={formDisabled}
          onToggleGroup={editor.toggleExpanded}
          onUpdateGroupTitle={editor.updateGroupTitle}
          onUpdateSkillName={editor.updateSkillName}
          onReorderSkills={editor.reorderSkillsInGroup}
          onDeleteSkill={editor.deleteSkill}
          onAddSkill={editor.addSkillToGroup}
        />

        <SettingsFooterLinksSection
          footerLinks={settings.footerLinks}
          expandedIds={editor.expandedIds}
          isLoading={isLoading}
          disabled={formDisabled}
          onToggleLink={editor.toggleExpanded}
          onAddLink={editor.addFooterLink}
          onReorder={editor.reorderFooterLinks}
          onDeleteLink={editor.deleteFooterLink}
          onUpdateLabel={editor.updateFooterLabel}
          onUpdateHref={editor.updateFooterHref}
          onUpdatePlatform={editor.updateFooterPlatform}
        />
      </div>
    </AdminFormShell>
  );
}

export default SettingsForm;
