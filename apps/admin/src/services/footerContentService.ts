import { supabase } from "@admin/lib/supabase";
import type { FooterLinkData } from "@shared/database/types/link";

type FooterLinkRow = {
  id: string;
  label: string;
  url: string;
  platform: string;
  display_order: number;
};

export async function getAdminFooterLinks(): Promise<FooterLinkData[]> {
  const { data, error } = await supabase
    .from("footer_links")
    .select("id, label, url, platform, display_order")
    .order("display_order", { ascending: true })
    .overrideTypes<FooterLinkRow[]>();

  if (error) {
    throw error;
  }

  return data.map((link) => ({
    id: link.id,
    label: link.label,
    href: link.url,
    platform: link.platform,
    displayOrder: link.display_order,
  }));
}

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
