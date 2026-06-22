import type { AdminSettingsData } from "@admin/services/settingsContentService";
import type { Language } from "@shared/database/types/language";
import { getLocalizedKey } from "@shared/utils/localizedField";
import type { Dispatch, SetStateAction } from "react";

import { useSettingsExpandedIds } from "./useSettingsExpandedIds";
import { useSettingsFooterLinksEditor } from "./useSettingsFooterLinksEditor";
import { useSettingsSkillGroupsEditor } from "./useSettingsSkillGroupsEditor";

type UseSettingsEditorParams = {
  language: Language;
  settings: AdminSettingsData;
  setSettings: Dispatch<SetStateAction<AdminSettingsData>>;
};

export function useSettingsEditor({
  language,
  settings,
  setSettings,
}: UseSettingsEditorParams) {
  const titleField = getLocalizedKey(language, "titlePl", "titleEn");
  const { expandedIds, addExpandedId, removeExpandedId, toggleExpanded } =
    useSettingsExpandedIds();

  const skillGroupsEditor = useSettingsSkillGroupsEditor({
    titleField,
    setSettings,
    addExpandedId,
    removeExpandedId,
  });

  const footerLinksEditor = useSettingsFooterLinksEditor({
    footerLinks: settings.footerLinks,
    setSettings,
    addExpandedId,
    removeExpandedId,
  });

  return {
    titleField,
    expandedIds,
    toggleExpanded,
    ...skillGroupsEditor,
    ...footerLinksEditor,
  };
}
