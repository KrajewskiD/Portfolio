import type { Language } from "@shared/database/types/language";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";

import { createTranslateFields } from "@admin/forms/createTranslateFields";
import type { TranslateFieldItem } from "@admin/hooks/useTranslateFields";

export function createActiveGroupSkillTranslateFields(
  group: SkillGroupData,
  language: Language,
  onApply: (
    skillId: string,
    field: "descriptionPl" | "descriptionEn",
    text: string,
  ) => void,
): TranslateFieldItem[] {
  return group.skills.flatMap((skill) =>
    createTranslateFields(
      skill,
      language,
      [
        {
          id: `skill-${skill.id}-description`,
          plKey: "descriptionPl",
          enKey: "descriptionEn",
        },
      ],
      (field, text) => onApply(skill.id, field, text),
    ),
  );
}

export function patchSkillInGroups(
  groups: SkillGroupData[],
  groupId: string,
  skillId: string,
  field: keyof Pick<Skill, "level" | "descriptionPl" | "descriptionEn">,
  value: string | number,
): SkillGroupData[] {
  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          skills: group.skills.map((skill) =>
            skill.id === skillId ? { ...skill, [field]: value } : skill,
          ),
        }
      : group,
  );
}
