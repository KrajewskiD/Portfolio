import { useQuery } from "@tanstack/react-query";

import {
  fetchTechnologyIconSvg,
  isValidTechnologyIconSlug,
  normalizeTechnologyIconSlug,
} from "@portfolio/scripts/fetchTechnologyIcon";

function useTechnologyIcon(iconSlug: string) {
  const normalizedSlug = normalizeTechnologyIconSlug(iconSlug);

  return useQuery({
    queryKey: ["technology-icon", normalizedSlug],
    queryFn: () => fetchTechnologyIconSvg(iconSlug),
    enabled: isValidTechnologyIconSlug(iconSlug),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
}

export default useTechnologyIcon;
