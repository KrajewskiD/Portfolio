import { useQuery } from "@tanstack/react-query";

import { getMainPage } from "../services/mainPageService";
import { publicContentQueryOptions } from "../utils/publicContentCache";

export function useMainPage() {
  return useQuery({
    queryKey: ["main-page"],
    queryFn: getMainPage,
    ...publicContentQueryOptions,
  });
}
