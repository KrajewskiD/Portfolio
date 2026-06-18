import { useCallback } from "react";

import {
  patchSettings,
  patchSkillGroupInSettings,
  patchSkillInSettings,
  updateFooterLink,
} from "@admin/forms/settings/settingsFormUpdates";
import type { AdminSettingsData } from "@admin/services/settingsContentService";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { Language } from "@shared/database/types/language";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";
import { createFooterLinkPlatform } from "@shared/utils/footerLink";
import { getLocalizedKey } from "@shared/utils/localizedField";
import type { Dispatch, SetStateAction } from "react";

function toggleExpandedId(expandedIds: Set<string>, id: string) {
  const next = new Set(expandedIds);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  return next;
}

type UseSettingsEditorParams = {
  language: Language;
  settings: AdminSettingsData;
  setSettings: Dispatch<SetStateAction<AdminSettingsData>>;
  expandedIds: Set<string>;
  setExpandedIds: Dispatch<SetStateAction<Set<string>>>;
};

export function useSettingsEditor({
  language,
  settings,
  setSettings,
  expandedIds,
  setExpandedIds,
}: UseSettingsEditorParams) {
  const titleField = getLocalizedKey(language, "titlePl", "titleEn");

  const addExpandedId = useCallback(
    (id: string) => {
      setExpandedIds((current) => new Set(current).add(id));
    },
    [setExpandedIds],
  );

  const removeExpandedId = useCallback(
    (id: string) => {
      setExpandedIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    },
    [setExpandedIds],
  );

  const toggleExpanded = useCallback(
    (id: string) => {
      setExpandedIds((current) => toggleExpandedId(current, id));
    },
    [setExpandedIds],
  );

  const updateGroupTitle = useCallback(
    (groupId: string, value: string) => {
      const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          [titleField]: nextValue,
        })),
      );
    },
    [setSettings, titleField],
  );

  const updateSkillName = useCallback(
    (groupId: string, skillId: string, value: string) => {
      const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

      setSettings((current) =>
        patchSkillInSettings(current, groupId, skillId, (skill) => ({
          ...skill,
          name: nextValue,
        })),
      );
    },
    [setSettings],
  );

  const updateFooterLabel = useCallback(
    (linkId: string, value: string) => {
      const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

      setSettings((current) =>
        updateFooterLink(current, linkId, (link) => ({
          ...link,
          label: nextValue,
        })),
      );
    },
    [setSettings],
  );

  const updateFooterHref = useCallback(
    (linkId: string, value: string) => {
      setSettings((current) =>
        updateFooterLink(current, linkId, (link) => ({
          ...link,
          href: value,
        })),
      );
    },
    [setSettings],
  );

  const updateFooterPlatform = useCallback(
    (linkId: string, value: string) => {
      const nextValue = createFooterLinkPlatform(value);

      setSettings((current) =>
        updateFooterLink(current, linkId, (link) => ({
          ...link,
          platform: nextValue,
        })),
      );
    },
    [setSettings],
  );

  const deleteSkillGroup = useCallback(
    (groupId: string) => {
      setSettings((current) =>
        patchSettings(current, {
          skillGroups: current.skillGroups.filter(
            (group) => group.id !== groupId,
          ),
        }),
      );
      removeExpandedId(`skills-group-${groupId}`);
    },
    [removeExpandedId, setSettings],
  );

  const deleteSkill = useCallback(
    (groupId: string, skillId: string) => {
      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          skills: group.skills.filter((skill) => skill.id !== skillId),
        })),
      );
      removeExpandedId(`skill-${skillId}`);
    },
    [removeExpandedId, setSettings],
  );

  const deleteFooterLink = useCallback(
    (linkId: string) => {
      setSettings((current) =>
        patchSettings(current, {
          footerLinks: current.footerLinks.filter((link) => link.id !== linkId),
        }),
      );
      removeExpandedId(`footer-${linkId}`);
    },
    [removeExpandedId, setSettings],
  );

  const addSkillGroup = useCallback(() => {
    const nextId = crypto.randomUUID();

    setSettings((current) =>
      patchSettings(current, {
        skillGroups: [
          ...current.skillGroups,
          {
            id: nextId,
            titlePl: "Nowa grupa PL",
            titleEn: "New group EN",
            skills: [],
          },
        ],
      }),
    );
  }, [setSettings]);

  const addSkillToGroup = useCallback(
    (groupId: string) => {
      const nextId = crypto.randomUUID();

      const nextSkill: Skill = {
        id: nextId,
        name: "Nowa umiejętność",
        level: 1,
      };

      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          skills: [...group.skills, nextSkill],
        })),
      );
      addExpandedId(`skills-group-${groupId}`);
    },
    [addExpandedId, setSettings],
  );

  const addFooterLink = useCallback(() => {
    const nextId = crypto.randomUUID();
    const nextIndex = settings.footerLinks.length + 1;
    const label = "Nowy link";

    const nextLink: FooterLinkData = {
      id: nextId,
      label,
      href: "#",
      platform: createFooterLinkPlatform(label),
      displayOrder: nextIndex,
    };

    setSettings((current) =>
      patchSettings(current, {
        footerLinks: [...current.footerLinks, nextLink],
      }),
    );
    addExpandedId(`footer-${nextId}`);
  }, [addExpandedId, setSettings, settings.footerLinks.length]);

  const reorderSkillGroups = useCallback(
    (nextGroups: SkillGroupData[]) => {
      setSettings((current) =>
        patchSettings(current, { skillGroups: nextGroups }),
      );
    },
    [setSettings],
  );

  const reorderSkillsInGroup = useCallback(
    (groupId: string, nextSkills: Skill[]) => {
      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          skills: nextSkills,
        })),
      );
    },
    [setSettings],
  );

  const reorderFooterLinks = useCallback(
    (nextLinks: FooterLinkData[]) => {
      setSettings((current) =>
        patchSettings(current, { footerLinks: nextLinks }),
      );
    },
    [setSettings],
  );

  return {
    titleField,
    expandedIds,
    toggleExpanded,
    updateGroupTitle,
    updateSkillName,
    updateFooterLabel,
    updateFooterHref,
    updateFooterPlatform,
    deleteSkillGroup,
    deleteSkill,
    deleteFooterLink,
    addSkillGroup,
    addSkillToGroup,
    addFooterLink,
    reorderSkillGroups,
    reorderSkillsInGroup,
    reorderFooterLinks,
  };
}
