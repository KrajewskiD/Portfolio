import type { Session } from "@supabase/supabase-js";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import { supabase } from "@admin/lib/supabase";
import { getMfaStatus, type MfaStatus } from "@admin/services/mfaService";

export type AdminAccessResolution =
  | { status: "authorized"; mfaStatus: MfaStatus }
  | { status: "unauthorized" }
  | { status: "error" };

export async function fetchClientSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function subscribeToAuthSession(
  onSessionChange: (session: Session | null) => void,
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onSessionChange(session);
  });

  return () => subscription.unsubscribe();
}

export async function resolveAdminAccess(
  userId: string,
): Promise<AdminAccessResolution> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { status: "error" };
  }

  if (!data) {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      return { status: "error" };
    }

    return { status: "unauthorized" };
  }

  try {
    const mfaStatus = await getMfaStatus();
    return { status: "authorized", mfaStatus };
  } catch {
    return { status: "error" };
  }
}

export function redirectToUnauthorizedLogin(): void {
  window.location.replace(
    `${getAdminUrl(adminRoute.login)}?error=unauthorized`,
  );
}

export async function signInWithGitHub(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}${getAdminUrl(adminRoute.dashboard)}`,
    },
  });

  if (error) {
    throw error;
  }
}

type SignOutScope = "global" | "local";

export async function signOut(scope: SignOutScope = "global"): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope });

  if (error) {
    throw error;
  }
}
