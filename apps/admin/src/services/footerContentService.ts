import { getFooterLinksFromDatabase } from "@shared/database";
import { mapFooterLinkToRow } from "@shared/database/footer/footerMapper";
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

  const rows = links.map(mapFooterLinkToRow);

  const { error } = await supabase.from("footer_links").upsert(rows);

  if (error) {
    throw error;
  }
}
