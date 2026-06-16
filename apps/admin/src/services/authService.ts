import { adminRoute, getAdminUrl } from "@shared/config/routes";
import { supabase } from "../lib/supabase";

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
