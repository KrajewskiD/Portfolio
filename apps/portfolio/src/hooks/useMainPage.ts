import { useQuery } from "@tanstack/react-query";

import { getMainPage } from "../services/mainPageService";

export function useMainPage() {
  return useQuery({
    queryKey: ["main-page"],
    queryFn: getMainPage,
  });
}
