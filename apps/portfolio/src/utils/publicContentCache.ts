import { removeLocalStorageCache } from "./localStorageCache";

export const PUBLIC_CONTENT_CACHE_TTL_MS = 1000 * 60 * 60 * 24;
export const PUBLIC_CONTENT_CACHE_SCHEMA_VERSION = 2;

const PUBLIC_CONTENT_CACHE_SCHEMA_KEY =
  "portfolio:public-content:schema-version";

export const publicContentQueryOptions = {
  gcTime: PUBLIC_CONTENT_CACHE_TTL_MS,
  staleTime: PUBLIC_CONTENT_CACHE_TTL_MS,
  retry: 2,
} as const;

export const publicContentCacheKeys = {
  footerLinks: "portfolio:public-content:footer-links",
  mainPage: "portfolio:public-content:main-page",
  profile: "portfolio:public-content:profile",
  projects: "portfolio:public-content:projects",
  skillGroups: "portfolio:public-content:skill-groups",
} as const;

export function clearPublicContentCache(): void {
  for (const key of Object.values(publicContentCacheKeys)) {
    removeLocalStorageCache(key);
  }
}

export function ensurePublicContentCacheSchema(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storage = window.localStorage;
    const storedVersion = storage.getItem(PUBLIC_CONTENT_CACHE_SCHEMA_KEY);

    if (storedVersion === String(PUBLIC_CONTENT_CACHE_SCHEMA_VERSION)) {
      return;
    }

    clearPublicContentCache();
    storage.setItem(
      PUBLIC_CONTENT_CACHE_SCHEMA_KEY,
      String(PUBLIC_CONTENT_CACHE_SCHEMA_VERSION),
    );
  } catch {
    clearPublicContentCache();
  }
}
