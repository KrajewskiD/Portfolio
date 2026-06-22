import type { FooterLinkData } from "../types/link";
import type { SkillGroupData } from "../types/skill";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function ensureUuid(value: string): string {
  return isUuid(value) ? value : crypto.randomUUID();
}

export function normalizeSkillGroupIds(
  groups: SkillGroupData[],
): SkillGroupData[] {
  return groups.map((group) => ({
    ...group,
    id: ensureUuid(group.id),
    skills: group.skills.map((skill) => ({
      ...skill,
      id: ensureUuid(skill.id),
    })),
  }));
}

export function normalizeFooterLinkIds(
  links: FooterLinkData[],
): FooterLinkData[] {
  return links.map((link) => ({
    ...link,
    id: ensureUuid(link.id),
  }));
}
