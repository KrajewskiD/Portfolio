import { useCallback, useMemo, useState } from "react";

import { skillGroupDrafts } from "@admin/data/adminDrafts";
import { patchSkillInGroups } from "@admin/forms/skillTranslatableFields";
import type { SkillGroupData } from "@shared/database/types/skill";
import type { Dispatch, SetStateAction } from "react";

type UseSkillsEditorParams = {
  skillGroups: SkillGroupData[];
  setSkillGroups: Dispatch<SetStateAction<SkillGroupData[]>>;
};

export function useSkillsEditor({
  skillGroups,
  setSkillGroups,
}: UseSkillsEditorParams) {
  const [activeGroupId, setActiveGroupId] = useState(
    skillGroupDrafts[0]?.id ?? "",
  );

  const activeGroup = useMemo(
    () =>
      skillGroups.find((group) => group.id === activeGroupId) ?? skillGroups[0],
    [activeGroupId, skillGroups],
  );

  const updateSkillLevel = useCallback(
    (skillId: string, level: number) => {
      if (!activeGroup) {
        return;
      }

      setSkillGroups((current) =>
        patchSkillInGroups(current, activeGroup.id, skillId, "level", level),
      );
    },
    [activeGroup, setSkillGroups],
  );

  return {
    activeGroup,
    activeGroupId: activeGroup?.id ?? "",
    setActiveGroupId,
    updateSkillLevel,
  };
}
