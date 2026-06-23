import type { Skill, SkillGroupData } from "@shared/database/types/skill";

export function patchSkillInGroups(
  groups: SkillGroupData[],
  groupId: string,
  skillId: string,
  field: keyof Pick<Skill, "level" | "showLevel">,
  value: Skill[typeof field],
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
