import type { ProjectTechnology, ProjectTopics } from "./project";

export type MainPage = {
  aboutSiteCode: string;
  aboutSiteProjectUrl: string;
  aboutSiteTitlePl: string;
  aboutSiteTitleEn: string;
  aboutSiteTechnologies: ProjectTechnology[];
  aboutSiteTopics: ProjectTopics;
};
