import type { FooterLinkData } from "@shared/database/types/link";
import type { MainPage } from "@shared/database/types/mainPage";
import type { Profile } from "@shared/database/types/profile";
import type { Project } from "@shared/database/types/project";
import type { SkillGroupData } from "@shared/database/types/skill";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isValidProfile(value: unknown): value is Profile {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.rolePl === "string" &&
    typeof value.roleEn === "string" &&
    typeof value.descriptionPl === "string" &&
    typeof value.descriptionEn === "string"
  );
}

export function isValidProjects(value: unknown): value is Project[] {
  return (
    Array.isArray(value) &&
    value.every(
      (project) =>
        isRecord(project) &&
        typeof project.id === "string" &&
        Array.isArray(project.topics) &&
        Array.isArray(project.technologies),
    )
  );
}

export function isValidSkillGroups(value: unknown): value is SkillGroupData[] {
  return (
    Array.isArray(value) &&
    value.every(
      (group) =>
        isRecord(group) &&
        typeof group.id === "string" &&
        Array.isArray(group.skills),
    )
  );
}

export function isValidFooterLinks(value: unknown): value is FooterLinkData[] {
  return (
    Array.isArray(value) &&
    value.every(
      (link) =>
        isRecord(link) &&
        typeof link.id === "string" &&
        typeof link.label === "string" &&
        typeof link.href === "string",
    )
  );
}

export function isValidMainPage(value: unknown): value is MainPage {
  return (
    isRecord(value) &&
    typeof value.aboutSiteTitlePl === "string" &&
    typeof value.aboutSiteTitleEn === "string" &&
    Array.isArray(value.aboutSiteTechnologies) &&
    Array.isArray(value.aboutSiteTopics)
  );
}
