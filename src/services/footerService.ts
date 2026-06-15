import { supabase } from "../lib/supabase";
import type { FooterLinkData } from "../types/link";

type FooterLinkRow = {
  id: string;
  label: string;
  url: string;
  display_order: number;
};

export async function getFooterLinks(): Promise<FooterLinkData[]> {
  const { data, error } = await supabase
    .from("footer_links")
    .select(
      `
      id,
      label,
      url,
      display_order
    `,
    )
    .order("display_order", { ascending: true })
    .overrideTypes<FooterLinkRow[]>();

  if (error) {
    throw error;
  }

  return data.map((link) => ({
    id: link.id,
    label: link.label,
    href: link.url,
  }));
}
