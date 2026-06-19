import { supabase } from "../lib/supabase";

type ProfileEmailResponse = {
  emailBase64?: string | null;
};

export type ProfileEmailFetchResult =
  | { kind: "success"; email: string }
  | { kind: "empty" }
  | { kind: "error" };

function decodeEmailBase64(value: string): string | null {
  try {
    const email = atob(value).trim();
    return email || null;
  } catch {
    return null;
  }
}

export async function fetchProfileContactEmail(): Promise<ProfileEmailFetchResult> {
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
