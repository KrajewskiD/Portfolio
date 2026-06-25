import { getAdminFooterLinks } from "@admin/services/footerContentService";
import { getAdminSkillGroups } from "@admin/services/skillContentService";
import { supabase } from "@admin/lib/supabase";
import {
  normalizeFooterLinkIds,
  normalizeSkillGroupIds,
} from "@shared/database";
import type { FooterLinkData } from "@shared/database/types/link";
import type { SkillGroupData } from "@shared/database/types/skill";

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

export async function saveAdminSettings({
  skillGroups,
  footerLinks,
}: AdminSettingsData): Promise<void> {
  const normalizedSkillGroups = normalizeSkillGroupIds(skillGroups);
  const normalizedFooterLinks = normalizeFooterLinkIds(footerLinks).map(
    (link, index) => ({
      ...link,
      displayOrder: index + 1,
    }),
  );

  const { error } = await supabase.rpc("save_admin_settings", {
    skill_groups_payload: normalizedSkillGroups,
    footer_links_payload: normalizedFooterLinks,
  });

  if (error) {
    throw error;
  }
}
