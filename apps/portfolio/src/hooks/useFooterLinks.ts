import { useQuery } from "@tanstack/react-query";

import { getFooterLinks } from "../services/footerService";
import { publicContentQueryOptions } from "../utils/publicContentCache";

export function useFooterLinks() {
  return useQuery({
    queryKey: ["footer-links"],
    queryFn: getFooterLinks,
    ...publicContentQueryOptions,
  });
}
