import type { FooterLinkData } from "../types/link";
import type { FooterLinkRow } from "./footerRows";

export function mapFooterLinkRow(link: FooterLinkRow): FooterLinkData {
  return {
    id: link.id,
    label: link.label,
    href: link.url,
    platform: link.platform,
    displayOrder: link.display_order,
  };
}

export function mapFooterLinkToRow(link: FooterLinkData) {
  return {
    id: link.id,
    label: link.label,
    url: link.href,
    platform: link.platform,
    display_order: link.displayOrder,
  };
}
