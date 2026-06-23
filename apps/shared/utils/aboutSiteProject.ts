import { normalizeProjectTopics } from "@shared/constants/projectTopics";
import type { MainPage } from "@shared/database/types/mainPage";
import type { Project } from "@shared/database/types/project";

export function getAboutSiteProject(mainPage: MainPage): Project {
  return normalizeProjectTopics({
    id: "about-site",
    code: mainPage.aboutSiteCode || undefined,
    projectUrl: mainPage.aboutSiteProjectUrl || undefined,
    titlePl: mainPage.aboutSiteTitlePl,
    titleEn: mainPage.aboutSiteTitleEn,
    miniatureAltPl: "",
    miniatureAltEn: "",
    technologies: mainPage.aboutSiteTechnologies,
    topics: mainPage.aboutSiteTopics,
  });
}

export function applyAboutSiteProject(
  mainPage: MainPage,
  project: Project,
): MainPage {
  return {
    ...mainPage,
    aboutSiteCode: project.code ?? "",
    aboutSiteProjectUrl: project.projectUrl ?? "",
    aboutSiteTitlePl: project.titlePl,
    aboutSiteTitleEn: project.titleEn,
    aboutSiteTechnologies: project.technologies,
    aboutSiteTopics: project.topics,
  };
}
