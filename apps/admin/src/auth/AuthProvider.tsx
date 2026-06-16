import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { adminRoute, getAdminUrl } from "@shared/config/routes";
import { supabase } from "../lib/supabase";
import { getMfaStatus, type MfaStatus } from "../services/mfaService";
import { AuthContext, type AuthStatus } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) {
        setSession(null);
        setMfaStatus(null);
        setAuthStatus("error");
        return;
      }

      setSession(data.session);
      setAuthStatus(data.session ? "checking" : "unauthenticated");
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthStatus(nextSession ? "checking" : "unauthenticated");

      if (!nextSession) {
        setMfaStatus(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    const userId = session.user.id;

    async function checkAdmin() {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setMfaStatus(null);
        setAuthStatus("error");
        return;
      }

      if (!data) {
        setMfaStatus(null);

        const { error: signOutError } = await supabase.auth.signOut();

        if (signOutError) {
          setAuthStatus("error");
          return;
        }

        window.location.replace(
          `${getAdminUrl(adminRoute.login)}?error=unauthorized`,
        );
        return;
      }

      try {
        const nextMfaStatus = await getMfaStatus();

        if (cancelled) return;

        setMfaStatus(nextMfaStatus);
        setAuthStatus("admin");
      } catch {
        if (cancelled) return;

        setMfaStatus(null);
        setAuthStatus("error");
      }
    }

    void checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        authStatus,
        isAdmin: authStatus === "admin",
        mfaStatus,
        isLoading: authStatus === "loading" || authStatus === "checking",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
