import { useQuery } from "@tanstack/react-query";

import { getFooterLinks } from "../services/footerService";

export function useFooterLinks() {
  return useQuery({
    queryKey: ["footer-links"],
    queryFn: getFooterLinks,
  });
}
