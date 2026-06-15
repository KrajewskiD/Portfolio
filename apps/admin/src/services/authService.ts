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

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
