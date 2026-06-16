import { createClient } from "@supabase/supabase-js";
import { env } from "@shared/config/env";

export const supabase = createClient(
  env.supabaseUrl,
  env.supabasePublishableKey,
  {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storage: window.sessionStorage,
    },
  },
);
