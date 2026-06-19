const ICONIFY_BASE_URL = "https://api.iconify.design";
const ICON_FOREGROUND_COLOR = "e4e5e8";

const ICON_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]+$/;

const iconMarkupCache = new Map<string, string>();

export function normalizeTechnologyIconSlug(iconSlug: string): string {
  let value = iconSlug.trim().toLowerCase();

  const urlMatch = value.match(/api\.iconify\.design\/(.+?)(?:\.svg)?$/);

  if (urlMatch) {
    value = urlMatch[1];
  }

  return value
    .replace(/\.svg$/i, "")
    .replace(/:/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
}

export function isValidTechnologyIconSlug(iconSlug: string): boolean {
  const normalized = normalizeTechnologyIconSlug(iconSlug);

  return ICON_SLUG_PATTERN.test(normalized);
}

export function getTechnologyIconUrl(iconSlug: string): string {
  const iconPath = normalizeTechnologyIconSlug(iconSlug);
  const [prefix, ...nameParts] = iconPath.split("/");
  const iconName = nameParts.join("/");
  const colorQuery = `color=%23${ICON_FOREGROUND_COLOR}`;

  return `${ICONIFY_BASE_URL}/${encodeURIComponent(prefix)}/${encodeURIComponent(iconName)}.svg?${colorQuery}`;
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

export function createTechnologyIconAltText(label: string): string {
  return `${label} icon`;
}

export function createAccessibleTechnologyIconSvg(
  markup: string,
  label: string,
): SVGSVGElement | null {
  const document = new DOMParser().parseFromString(markup, "image/svg+xml");
  const parseError = document.querySelector("parsererror");

  if (parseError) {
    return null;
  }

  const svg = document.querySelector("svg");

  if (!svg) {
    return null;
  }

  const altText = createTechnologyIconAltText(label);

  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", altText);
  svg.setAttribute("focusable", "false");

  const existingTitle = svg.querySelector("title");

  if (existingTitle) {
    existingTitle.textContent = altText;
  } else {
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = altText;
    svg.prepend(title);
  }

  return svg;
}

export async function fetchTechnologyIconElement(
  iconSlug: string,
  label?: string,
): Promise<SVGSVGElement | null> {
  const markup = await fetchTechnologyIconSvg(iconSlug);

  if (!markup) {
    return null;
  }

  if (label) {
    return createAccessibleTechnologyIconSvg(markup, label);
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
