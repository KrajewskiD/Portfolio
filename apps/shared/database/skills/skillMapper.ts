import type { SkillGroupData } from "../types/skill";
import type { SkillGroupRow } from "./skillRows";

export function mapSkillGroupRow(group: SkillGroupRow): SkillGroupData {
  return {
    id: group.id,
    titlePl: group.title_pl,
    titleEn: group.title_en,
    skills: group.skills
      .toSorted((first, second) => first.display_order - second.display_order)
      .flatMap((skill) =>
        skill.technologies
          ? [
              {
                id: skill.id,
                name: skill.technologies.name,
                level: skill.level,
              },
            ]
          : [],
      ),
  };
}

export function mapSkillGroupToRow(
  group: SkillGroupData,
  displayOrder: number,
) {
  return {
    id: group.id,
    title_pl: group.titlePl,
    title_en: group.titleEn,
    display_order: displayOrder,
  };
}

export function mapSkillToRow(
  skill: SkillGroupData["skills"][number],
  groupId: string,
  technologyId: string,
  displayOrder: number,
) {
  return {
    id: skill.id,
    group_id: groupId,
    technology_id: technologyId,
    description_pl: "",
    description_en: "",
    level: skill.level,
    display_order: displayOrder,
  };
}
