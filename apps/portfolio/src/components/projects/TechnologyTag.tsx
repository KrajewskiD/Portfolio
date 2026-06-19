import { isValidTechnologyIconSlug } from "@portfolio/scripts/fetchTechnologyIcon";

import SiteTooltip from "../SiteTooltip";
import TechnologyIcon from "./TechnologyIcon";

type TechnologyTagProps = {
  label: string;
  iconSlug?: string;
};

function TechnologyTag({ label, iconSlug }: TechnologyTagProps) {
  const trimmedSlug = iconSlug?.trim() ?? "";

  if (!isValidTechnologyIconSlug(trimmedSlug)) {
    return (
      <span className="site-tag">
        <span className="site-tag__label">{label}</span>
      </span>
    );
  }

  return (
    <SiteTooltip message={label}>
      <span className="site-tag">
        <TechnologyIcon iconSlug={trimmedSlug} label={label} />
      </span>
    </SiteTooltip>
  );
}

export default TechnologyTag;
