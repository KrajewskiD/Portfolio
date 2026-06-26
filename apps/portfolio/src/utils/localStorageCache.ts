import { PUBLIC_CONTENT_CACHE_SCHEMA_VERSION } from "./publicContentCache";

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
  schemaVersion: number;
};

export type LocalStorageCacheOptions<T> = {
  validate?: (data: unknown) => data is T;
  maxStaleMs?: number;
};

function getLocalStorage(): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function removeLocalStorageCache(key: string): void {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage failures and let the next fetch rebuild the cache.
  }
}

function readLocalStorageCacheEntry<T>(
  key: string,
): CacheEntry<T> | undefined {
  const storage = getLocalStorage();

  if (!storage) {
    return undefined;
  }

  try {
    const rawEntry = storage.getItem(key);

    if (!rawEntry) {
      return undefined;
    }

    const entry = JSON.parse(rawEntry) as Partial<CacheEntry<T>>;

    if (
      entry.schemaVersion !== PUBLIC_CONTENT_CACHE_SCHEMA_VERSION ||
      typeof entry.expiresAt !== "number" ||
      entry.data === undefined
    ) {
      removeLocalStorageCache(key);
      return undefined;
    }

    return entry as CacheEntry<T>;
  } catch {
    removeLocalStorageCache(key);
    return undefined;
  }
}

function isValidCachedData<T>(
  value: unknown,
  validate?: (value: unknown) => value is T,
): value is T {
  return validate ? validate(value) : true;
}

export function readLocalStorageCache<T>(key: string): T | undefined {
  const entry = readLocalStorageCacheEntry<T>(key);

  if (!entry || Date.now() > entry.expiresAt) {
    return undefined;
  }

  return entry.data;
}

function readStaleLocalStorageCache<T>(
  key: string,
  maxStaleMs: number,
): T | undefined {
  const entry = readLocalStorageCacheEntry<T>(key);

  if (!entry) {
    return undefined;
  }

  if (Date.now() > entry.expiresAt + maxStaleMs) {
    removeLocalStorageCache(key);
    return undefined;
  }

  return entry.data;
}

export function writeLocalStorageCache<T>(
  key: string,
  data: T,
  ttlMs: number,
): void {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttlMs,
    schemaVersion: PUBLIC_CONTENT_CACHE_SCHEMA_VERSION,
  };

  try {
    storage.setItem(key, JSON.stringify(entry));
  } catch {
    removeLocalStorageCache(key);
  }
}

export async function getWithLocalStorageCache<T>(
  key: string,
  ttlMs: number,
  fetchData: () => Promise<T>,
  options: LocalStorageCacheOptions<T> = {},
): Promise<T> {
  const maxStaleMs = options.maxStaleMs ?? ttlMs * 24;
  const cachedData = readLocalStorageCache<T>(key);

  if (
    cachedData !== undefined &&
    isValidCachedData(cachedData, options.validate)
  ) {
    return cachedData;
  }

  if (cachedData !== undefined) {
    removeLocalStorageCache(key);
  }

  try {
    const data = await fetchData();

    if (!isValidCachedData(data, options.validate)) {
      throw new Error(`Invalid cache payload for "${key}".`);
    }

    writeLocalStorageCache(key, data, ttlMs);
    return data;
  } catch (error) {
    const staleData = readStaleLocalStorageCache<T>(key, maxStaleMs);

    if (
      staleData !== undefined &&
      isValidCachedData(staleData, options.validate)
    ) {
      return staleData;
    }

    removeLocalStorageCache(key);
    throw error;
  }
}
