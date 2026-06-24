import type { FooterData } from "@shared/database/types/footer";
import type { Language } from "@shared/database/types/language";
import type { FooterLinkData } from "@shared/database/types/link";
import type { MainPage } from "@shared/database/types/mainPage";
import type { Profile } from "@shared/database/types/profile";
import { getAboutSiteProject } from "@shared/utils/aboutSiteProject";
import { getLocalizedField } from "@shared/utils/localizedField";

type BuildFooterDataOptions = {
  footerLinks?: FooterLinkData[];
  language: Language;
  profile?: Profile;
};

export function buildFooterData({
  footerLinks,
  language,
  profile,
}: BuildFooterDataOptions): FooterData | undefined {
  if (!profile && !footerLinks?.length) {
    return undefined;
  }

  return {
    name: profile?.name ?? "",
    description: profile
      ? getLocalizedField(
          profile,
          language,
          "footerDescriptionPl",
          "footerDescriptionEn",
        )
      : "",
    links: footerLinks ?? [],
  };
}

export function buildFeaturedProject(mainPage?: MainPage) {
  return mainPage ? getAboutSiteProject(mainPage) : undefined;
}
