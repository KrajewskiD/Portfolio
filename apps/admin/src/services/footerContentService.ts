import { getFooterLinksFromDatabase } from "@shared/database";
import { supabase } from "@admin/lib/supabase";
import type { FooterLinkData } from "@shared/database/types/link";

export async function getAdminFooterLinks(): Promise<FooterLinkData[]> {
  return getFooterLinksFromDatabase(supabase);
}

// Empty array is valid after syncDeletedFooterLinks removes deleted rows.
export async function saveAdminFooterLinks(
  links: FooterLinkData[],
): Promise<void> {
  if (links.length === 0) {
    return;
  }

  const rows = links.map((link) => ({
    id: link.id,
    label: link.label,
    url: link.href,
    platform: link.platform,
    display_order: link.displayOrder,
  }));

  const { error } = await supabase.from("footer_links").upsert(rows);

  if (error) {
    throw error;
  }
}
