import { useState } from "react";

import {
  createTechnologyIconAltText,
  getTechnologyIconUrl,
} from "@portfolio/scripts/fetchTechnologyIcon";

type TechnologyIconProps = {
  iconSlug: string;
  label: string;
};

function TechnologyIcon({ iconSlug, label }: TechnologyIconProps) {
  const [hasError, setHasError] = useState(false);
  const trimmedSlug = iconSlug.trim();

  if (hasError) {
    return <span className="site-tag__label">{label}</span>;
  }

  return (
    <img
      src={getTechnologyIconUrl(trimmedSlug)}
      alt={createTechnologyIconAltText(label)}
      className="site-tag__icon-image"
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}

export default TechnologyIcon;
