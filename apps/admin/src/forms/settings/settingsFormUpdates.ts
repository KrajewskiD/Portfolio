import type { AdminSettingsData } from "@admin/services/settingsContentService";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";

export function patchSettings(
  settings: AdminSettingsData,
  patch: Partial<AdminSettingsData>,
): AdminSettingsData {
  return { ...settings, ...patch };
}

export function patchSkillGroupInSettings(
  settings: AdminSettingsData,
  groupId: string,
  updater: (group: SkillGroupData) => SkillGroupData,
): AdminSettingsData {
  return patchSettings(settings, {
    skillGroups: settings.skillGroups.map((group) =>
      group.id === groupId ? updater(group) : group,
    ),
  });
}

export function patchSkillInSettings(
  settings: AdminSettingsData,
  groupId: string,
  skillId: string,
  updater: (skill: Skill) => Skill,
): AdminSettingsData {
  return patchSkillGroupInSettings(settings, groupId, (group) => ({
    ...group,
    skills: group.skills.map((skill) =>
      skill.id === skillId ? updater(skill) : skill,
    ),
  }));
}

export function updateFooterLink(
  settings: AdminSettingsData,
  linkId: string,
  updater: (link: FooterLinkData) => FooterLinkData,
): AdminSettingsData {
  return patchSettings(settings, {
    footerLinks: settings.footerLinks.map((link) =>
      link.id === linkId ? updater(link) : link,
    ),
  });
}
