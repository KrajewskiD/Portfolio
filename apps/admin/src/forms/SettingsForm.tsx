import { useState } from "react";

import SettingsFooterLinksSection from "@admin/components/settings/SettingsFooterLinksSection";
import SettingsSkillGroupsSection from "@admin/components/settings/SettingsSkillGroupsSection";
import SettingsSkillNamesSection from "@admin/components/settings/SettingsSkillNamesSection";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormFeedback from "@admin/components/ui/AdminFormFeedback";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminSaveButton from "@admin/components/ui/AdminSaveButton";
import { footerLinkDrafts, skillGroupDrafts } from "@admin/data/adminDrafts";
import { useSettingsEditor } from "@admin/forms/settings/useSettingsEditor";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettingsData,
} from "@admin/services/settingsContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import {
  normalizeFooterLinkIds,
  normalizeSkillGroupIds,
} from "@shared/database";

function SettingsForm({ language }: AdminFormProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const { isOverlayOpen } = useTranslationOverlay();

  const {
    value: settings,
    setValue: setSettings,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminForm<AdminSettingsData>({
    initialValue: {
      skillGroups: skillGroupDrafts,
      footerLinks: footerLinkDrafts,
    },
    loadValue: getAdminSettings,
    saveValue: saveAdminSettings,
    prepareBeforeSave: async (settings) => ({
      skillGroups: normalizeSkillGroupIds(settings.skillGroups),
      footerLinks: normalizeFooterLinkIds(settings.footerLinks),
    }),
  });

  const editor = useSettingsEditor({
    language,
    settings,
    setSettings,
    expandedIds,
    setExpandedIds,
  });

  const formDisabled = isLoading || isSaving;

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Ustawienia"
        description="Edytuj nazwy grup umiejętności, nazwy umiejętności oraz linki w stopce."
        actions={
          <AdminFormActions>
            <AdminSaveButton
              disabled={formDisabled || isOverlayOpen}
              isSaving={isSaving}
              onSave={save}
            />
          </AdminFormActions>
        }
      />

      <AdminFormFeedback
        loadError={loadError}
        saveError={saveError}
        saveSuccess={saveSuccess}
      />

      <AdminPanel>
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
      </AdminPanel>
    </section>
  );
}

export default SettingsForm;
