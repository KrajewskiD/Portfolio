import type { Language } from "@shared/database/types/language";

export function parseLanguage(value: string | null): Language | undefined {
  return value === "pl" || value === "en" ? value : undefined;
}

function getLanguageFromPath(pathname: string): Language | undefined {
  const [firstSegment] = pathname.split("/").filter(Boolean);

  return parseLanguage(firstSegment ?? null);
}

export function getSectionIdFromHash(hash: string): string | undefined {
  const sectionId = hash.replace(/^#/, "");

  return sectionId || undefined;
}

export function getLanguageFromUrl(): Language | undefined {
  return getLanguageFromPath(window.location.pathname);
}

export function createLanguageSectionHref(
  sectionHref: string,
  language: Language,
): string {
  const sectionId = getSectionIdFromHash(sectionHref);

  return sectionId ? `/${language}#${sectionId}` : `/${language}`;
}

export function updateLanguageUrl(language: Language) {
  const url = new URL(window.location.href);
  const sectionId = getSectionIdFromHash(url.hash);

  url.pathname = `/${language}`;
  url.search = "";
  url.hash = sectionId ? sectionId : "";

  window.history.replaceState(window.history.state, "", url);
}

export function scrollToHashSection() {
  const sectionId = getSectionIdFromHash(window.location.hash);

  if (!sectionId) {
    return;
  }

  requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
