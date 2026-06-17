import type { Language } from "@shared/database/types/language";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";
import {
  getLocalizedField,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

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
  return group.skills.map((skill) => ({
    id: `skill-${skill.id}-description`,
    sourceText: getLocalizedField(
      skill,
      language,
      "descriptionPl",
      "descriptionEn",
    ),
    onApply: (text) =>
      onApply(
        skill.id,
        getOppositeLocalizedKey(language, "descriptionPl", "descriptionEn"),
        text,
      ),
  }));
}

export function updateSkillInGroups(
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
