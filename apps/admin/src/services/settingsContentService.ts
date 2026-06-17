import {
  getAdminFooterLinks,
  saveAdminFooterLinks,
} from "@admin/services/footerContentService";
import {
  getAdminSkillGroups,
  saveAdminSkillGroups,
} from "@admin/services/skillContentService";
import { supabase } from "@admin/lib/supabase";
import type { FooterLinkData } from "@shared/types/link";
import type { SkillGroupData } from "@shared/types/skill";

export type AdminSettingsData = {
  skillGroups: SkillGroupData[];
  footerLinks: FooterLinkData[];
};

export async function getAdminSettings(): Promise<AdminSettingsData> {
  const [skillGroups, footerLinks] = await Promise.all([
    getAdminSkillGroups(),
    getAdminFooterLinks(),
  ]);

  return {
    skillGroups,
    footerLinks,
  };
}

async function syncDeletedSkillGroups(groups: SkillGroupData[]): Promise<void> {
  const existingGroups = await getAdminSkillGroups();
  const groupIds = new Set(groups.map((group) => group.id));
  const skillIds = new Set(
    groups.flatMap((group) => group.skills.map((skill) => skill.id)),
  );

  for (const group of existingGroups) {
    for (const skill of group.skills) {
      if (!skillIds.has(skill.id)) {
        const { error } = await supabase
          .from("skills")
          .delete()
          .eq("id", skill.id);

        if (error) {
          throw error;
        }
      }
    }

    if (!groupIds.has(group.id)) {
      const { error } = await supabase
        .from("skill_groups")
        .delete()
        .eq("id", group.id);

      if (error) {
        throw error;
      }
    }
  }
}

async function syncDeletedFooterLinks(links: FooterLinkData[]): Promise<void> {
  const existingLinks = await getAdminFooterLinks();
  const linkIds = new Set(links.map((link) => link.id));

  for (const link of existingLinks) {
    if (!linkIds.has(link.id)) {
      const { error } = await supabase
        .from("footer_links")
        .delete()
        .eq("id", link.id);

      if (error) {
        throw error;
      }
    }
  }
}

export async function saveAdminSettings({
  skillGroups,
  footerLinks,
}: AdminSettingsData): Promise<void> {
  const normalizedFooterLinks = footerLinks.map((link, index) => ({
    ...link,
    displayOrder: index + 1,
  }));

  await syncDeletedSkillGroups(skillGroups);
  await syncDeletedFooterLinks(normalizedFooterLinks);
  await saveAdminSkillGroups(skillGroups);
  await saveAdminFooterLinks(normalizedFooterLinks);
}
