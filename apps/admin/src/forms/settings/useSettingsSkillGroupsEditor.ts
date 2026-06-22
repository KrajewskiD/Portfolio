import { useCallback } from "react";

import {
  patchSettings,
  patchSkillGroupInSettings,
  patchSkillInSettings,
} from "@admin/forms/settings/settingsFormUpdates";
import type { AdminSettingsData } from "@admin/services/settingsContentService";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { Skill, SkillGroupData } from "@shared/database/types/skill";
import type { Dispatch, SetStateAction } from "react";

type UseSettingsSkillGroupsEditorParams = {
  titleField: "titlePl" | "titleEn";
  setSettings: Dispatch<SetStateAction<AdminSettingsData>>;
  addExpandedId: (id: string) => void;
  removeExpandedId: (id: string) => void;
};

export function useSettingsSkillGroupsEditor({
  titleField,
  setSettings,
  addExpandedId,
  removeExpandedId,
}: UseSettingsSkillGroupsEditorParams) {
  const updateGroupTitle = useCallback(
    (groupId: string, value: string) => {
      const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          [titleField]: nextValue,
        })),
      );
    },
    [setSettings, titleField],
  );

  const updateSkillName = useCallback(
    (groupId: string, skillId: string, value: string) => {
      const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

      setSettings((current) =>
        patchSkillInSettings(current, groupId, skillId, (skill) => ({
          ...skill,
          name: nextValue,
        })),
      );
    },
    [setSettings],
  );

  const deleteSkillGroup = useCallback(
    (groupId: string) => {
      setSettings((current) =>
        patchSettings(current, {
          skillGroups: current.skillGroups.filter(
            (group) => group.id !== groupId,
          ),
        }),
      );
      removeExpandedId(`skills-group-${groupId}`);
    },
    [removeExpandedId, setSettings],
  );

  const deleteSkill = useCallback(
    (groupId: string, skillId: string) => {
      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          skills: group.skills.filter((skill) => skill.id !== skillId),
        })),
      );
      removeExpandedId(`skill-${skillId}`);
    },
    [removeExpandedId, setSettings],
  );

  const addSkillGroup = useCallback(() => {
    const nextId = crypto.randomUUID();

    setSettings((current) =>
      patchSettings(current, {
        skillGroups: [
          ...current.skillGroups,
          {
            id: nextId,
            titlePl: "Nowa grupa PL",
            titleEn: "New group EN",
            skills: [],
          },
        ],
      }),
    );
  }, [setSettings]);

  const addSkillToGroup = useCallback(
    (groupId: string) => {
      const nextId = crypto.randomUUID();

      const nextSkill: Skill = {
        id: nextId,
        name: "Nowa umiejętność",
        level: 1,
      };

      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          skills: [...group.skills, nextSkill],
        })),
      );
      addExpandedId(`skills-group-${groupId}`);
    },
    [addExpandedId, setSettings],
  );

  const reorderSkillGroups = useCallback(
    (nextGroups: SkillGroupData[]) => {
      setSettings((current) =>
        patchSettings(current, { skillGroups: nextGroups }),
      );
    },
    [setSettings],
  );

  const reorderSkillsInGroup = useCallback(
    (groupId: string, nextSkills: Skill[]) => {
      setSettings((current) =>
        patchSkillGroupInSettings(current, groupId, (group) => ({
          ...group,
          skills: nextSkills,
        })),
      );
    },
    [setSettings],
  );

  return {
    updateGroupTitle,
    updateSkillName,
    deleteSkillGroup,
    deleteSkill,
    addSkillGroup,
    addSkillToGroup,
    reorderSkillGroups,
    reorderSkillsInGroup,
  };
}
