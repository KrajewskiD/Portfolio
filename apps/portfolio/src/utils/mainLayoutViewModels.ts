import type { FooterData } from "@shared/database/types/footer";
import type { FooterLinkData } from "@shared/database/types/link";
import type { MainPage } from "@shared/database/types/mainPage";
import { getAboutSiteProject } from "@shared/utils/aboutSiteProject";

type BuildFooterDataOptions = {
  footerLinks?: FooterLinkData[];
};

export function buildFooterData({
  footerLinks,
}: BuildFooterDataOptions): FooterData | undefined {
  if (!footerLinks?.length) {
    return undefined;
  }

  return {
    links: footerLinks,
  };
}

export function buildFeaturedProject(mainPage?: MainPage) {
  return mainPage ? getAboutSiteProject(mainPage) : undefined;
}
