import { useState } from "react";

import { footerLinkDrafts, skillGroupDrafts } from "@admin/data/adminDrafts";
import { useSettingsEditor } from "@admin/forms/settings/useSettingsEditor";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettingsData,
} from "@admin/services/settingsContentService";
import type { Language } from "@shared/database/types/language";

export function useSettingsForm(language: Language) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const { isOverlayOpen } = useTranslationOverlay();

  const form = useAdminForm<AdminSettingsData>({
    initialValue: {
      skillGroups: skillGroupDrafts,
      footerLinks: footerLinkDrafts,
    },
    loadValue: getAdminSettings,
    saveValue: saveAdminSettings,
  });

  const editor = useSettingsEditor({
    language,
    settings: form.value,
    setSettings: form.setValue,
    expandedIds,
    setExpandedIds,
  });

  const formDisabled = form.isLoading || form.isSaving || isOverlayOpen;

  return {
    settings: form.value,
    isLoading: form.isLoading,
    isSaving: form.isSaving,
    loadError: form.loadError,
    saveError: form.saveError,
    saveSuccess: form.saveSuccess,
    save: form.save,
    formDisabled,
    editor,
  };
}
