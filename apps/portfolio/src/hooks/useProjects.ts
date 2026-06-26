import { useQuery } from "@tanstack/react-query";

import { getProjects } from "../services/projectService";
import { publicContentQueryOptions } from "../utils/publicContentCache";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    ...publicContentQueryOptions,
  });
}
