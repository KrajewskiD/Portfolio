import { normalizeProjectTopics } from "../../constants/projectTopics";
import type { MainPage } from "../types/mainPage";
import type { ProjectTechnology, ProjectTopicContent } from "../types/project";
import type { MainPageRow } from "./mainPageRows";

function mapAboutSiteTechnologies(value: unknown): ProjectTechnology[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.name !== "string" ||
      typeof item.iconSlug !== "string"
    ) {
      return [];
    }

    return [{ name: item.name, iconSlug: item.iconSlug }];
  });
}

function mapAboutSiteTopics(value: unknown): ProjectTopicContent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.id !== "string" ||
      typeof item.contentPl !== "string" ||
      typeof item.contentEn !== "string"
    ) {
      return [];
    }

    return [
      {
        id: item.id,
        contentPl: item.contentPl,
        contentEn: item.contentEn,
        imageAltPl: typeof item.imageAltPl === "string" ? item.imageAltPl : "",
        imageAltEn: typeof item.imageAltEn === "string" ? item.imageAltEn : "",
      } as ProjectTopicContent,
    ];
  });
}

export function mapMainPageRow(data: MainPageRow): MainPage {
  return {
    aboutSiteCode: data.about_site_code ?? "",
    aboutSiteProjectUrl: data.about_site_project_url ?? "",
    aboutSiteTitlePl: data.about_site_title_pl ?? "",
    aboutSiteTitleEn: data.about_site_title_en ?? "",
    aboutSiteTechnologies: mapAboutSiteTechnologies(
      data.about_site_technologies,
    ),
    aboutSiteTopics: normalizeProjectTopics({
      id: "about-site",
      titlePl: "",
      titleEn: "",
      miniatureAltPl: "",
      miniatureAltEn: "",
      technologies: [],
      topics: mapAboutSiteTopics(data.about_site_topics),
    }).topics,
  };
}

export function mapMainPageToRow(mainPage: MainPage): MainPageRow {
  return {
    about_site_code: mainPage.aboutSiteCode,
    about_site_project_url: mainPage.aboutSiteProjectUrl,
    about_site_title_pl: mainPage.aboutSiteTitlePl,
    about_site_title_en: mainPage.aboutSiteTitleEn,
    about_site_technologies: mainPage.aboutSiteTechnologies,
    about_site_topics: mainPage.aboutSiteTopics,
  };
}
