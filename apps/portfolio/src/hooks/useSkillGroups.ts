import { useQuery } from "@tanstack/react-query";

import { getSkillGroups } from "../services/skillService";

export function useSkillGroups() {
  return useQuery({
    queryKey: ["skill-groups"],
    queryFn: getSkillGroups,
  });
}
