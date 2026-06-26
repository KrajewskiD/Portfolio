import { useQuery } from "@tanstack/react-query";

import { getSkillGroups } from "../services/skillService";
import { publicContentQueryOptions } from "../utils/publicContentCache";

export function useSkillGroups() {
  return useQuery({
    queryKey: ["skill-groups"],
    queryFn: getSkillGroups,
    ...publicContentQueryOptions,
  });
}
