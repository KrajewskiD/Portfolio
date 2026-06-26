import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../services/profileService";
import { publicContentQueryOptions } from "../utils/publicContentCache";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    ...publicContentQueryOptions,
  });
}
