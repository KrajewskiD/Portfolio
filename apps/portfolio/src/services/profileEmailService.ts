import { supabase } from "../lib/supabase";

type ProfileEmailResponse = {
  emailBase64?: string | null;
};

export type ProfileEmailFetchResult =
  | { kind: "success"; email: string }
  | { kind: "empty" }
  | { kind: "error" };

const EMAIL_SESSION_CACHE_KEY = "portfolio:profile-email";
const MIN_EMAIL_FETCH_INTERVAL_MS = 60_000;

let lastEmailFetchAt = 0;
let inFlightEmailFetch: Promise<ProfileEmailFetchResult> | null = null;

function decodeEmailBase64(value: string): string | null {
  try {
    const email = atob(value).trim();
    return email || null;
  } catch {
    return null;
  }
}

function readSessionEmailCache(): ProfileEmailFetchResult | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const rawEntry = window.sessionStorage.getItem(EMAIL_SESSION_CACHE_KEY);

    if (!rawEntry) {
      return undefined;
    }

    return JSON.parse(rawEntry) as ProfileEmailFetchResult;
  } catch {
    return undefined;
  }
}

function writeSessionEmailCache(result: ProfileEmailFetchResult): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(EMAIL_SESSION_CACHE_KEY, JSON.stringify(result));
  } catch {
    // Ignore storage failures.
  }
}

async function fetchProfileContactEmailFromApi(): Promise<ProfileEmailFetchResult> {
  const { data, error } = await supabase.functions.invoke<ProfileEmailResponse>(
    "encode-profile-email",
    { method: "POST" },
  );

  if (error) {
    return { kind: "error" };
  }

  if (!data?.emailBase64) {
    return { kind: "empty" };
  }

  const email = decodeEmailBase64(data.emailBase64);

  if (email) {
    return { kind: "success", email };
  }

  return { kind: "empty" };
}

export async function fetchProfileContactEmail(): Promise<ProfileEmailFetchResult> {
  const cachedResult = readSessionEmailCache();

  if (cachedResult) {
    return cachedResult;
  }

  if (inFlightEmailFetch) {
    return inFlightEmailFetch;
  }

  const now = Date.now();

  if (now - lastEmailFetchAt < MIN_EMAIL_FETCH_INTERVAL_MS) {
    return { kind: "error" };
  }

  lastEmailFetchAt = now;
  inFlightEmailFetch = fetchProfileContactEmailFromApi()
    .then((result) => {
      if (result.kind === "error") {
        lastEmailFetchAt = 0;
        return result;
      }

      writeSessionEmailCache(result);
      return result;
    })
    .finally(() => {
      inFlightEmailFetch = null;
    });

  return inFlightEmailFetch;
}
