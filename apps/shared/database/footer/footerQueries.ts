import type { SupabaseClient } from "@supabase/supabase-js";

import type { FooterLinkData } from "../types/link";
import { mapFooterLinkRow } from "./footerMapper";
import type { FooterLinkRow } from "./footerRows";

export async function getFooterLinksFromDatabase(
  supabase: SupabaseClient,
): Promise<FooterLinkData[]> {
  const { data, error } = await supabase
    .from("footer_links")
    .select("id, label, url, platform, display_order")
    .order("display_order", { ascending: true })
    .overrideTypes<FooterLinkRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapFooterLinkRow);
}
