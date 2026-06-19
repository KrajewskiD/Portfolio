const ICONIFY_LOGOS_BASE_URL = "https://api.iconify.design/logos";

const ICON_SLUG_PATTERN = /^[a-z0-9-]+$/i;

const iconMarkupCache = new Map<string, string>();

export function normalizeTechnologyIconSlug(iconSlug: string): string {
  return iconSlug.trim().toLowerCase();
}

export function isValidTechnologyIconSlug(iconSlug: string): boolean {
  const normalized = normalizeTechnologyIconSlug(iconSlug);

  return normalized.length > 0 && ICON_SLUG_PATTERN.test(normalized);
}

function getTechnologyIconUrl(iconSlug: string): string {
  const normalized = normalizeTechnologyIconSlug(iconSlug);

  return `${ICONIFY_LOGOS_BASE_URL}/${encodeURIComponent(normalized)}.svg`;
}

export async function fetchTechnologyIconSvg(
  iconSlug: string,
): Promise<string | null> {
  if (!isValidTechnologyIconSlug(iconSlug)) {
    return null;
  }

  const normalized = normalizeTechnologyIconSlug(iconSlug);
  const cachedMarkup = iconMarkupCache.get(normalized);

  if (cachedMarkup) {
    return cachedMarkup;
  }

  try {
    const response = await fetch(getTechnologyIconUrl(normalized));

    if (!response.ok) {
      return null;
    }

    const markup = (await response.text()).trim();

    if (!markup.includes("<svg")) {
      return null;
    }

    iconMarkupCache.set(normalized, markup);

    return markup;
  } catch {
    return null;
  }
}

export async function fetchTechnologyIconElement(
  iconSlug: string,
): Promise<SVGSVGElement | null> {
  const markup = await fetchTechnologyIconSvg(iconSlug);

  if (!markup) {
    return null;
  }

  const document = new DOMParser().parseFromString(markup, "image/svg+xml");
  const parseError = document.querySelector("parsererror");

  if (parseError) {
    return null;
  }

  const svg = document.querySelector("svg");

  if (!svg) {
    return null;
  }

  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  return svg;
}
