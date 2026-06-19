import { useEffect, useRef } from "react";

import useTechnologyIcon from "@portfolio/hooks/useTechnologyIcon";

type TechnologyIconProps = {
  iconSlug: string;
  className?: string;
};

function TechnologyIcon({ iconSlug, className = "" }: TechnologyIconProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const { data: svgMarkup } = useTechnologyIcon(iconSlug);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    host.replaceChildren();

    if (!svgMarkup) {
      return;
    }

    const document = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
    const parseError = document.querySelector("parsererror");

    if (parseError) {
      return;
    }

    const svg = document.querySelector("svg");

    if (!svg) {
      return;
    }

    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    host.append(svg);
  }, [svgMarkup]);

  return (
    <span
      ref={hostRef}
      className={["site-tag__icon", className].filter(Boolean).join(" ")}
      aria-hidden
    />
  );
}

export default TechnologyIcon;
