import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import type { AuthStatus } from "@admin/auth/AuthContext";
import {
  fetchClientSession,
  redirectToUnauthorizedLogin,
  resolveAdminAccess,
  subscribeToAuthSession,
} from "@admin/services/authService";
import type { MfaStatus } from "@admin/services/mfaService";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const nextSession = await fetchClientSession();

        if (cancelled) {
          return;
        }

        setSession(nextSession);
        setAuthStatus(nextSession ? "checking" : "unauthenticated");
      } catch {
        if (cancelled) {
          return;
        }

        setSession(null);
        setMfaStatus(null);
        setAuthStatus("error");
      }
    }

    void loadSession();

    const unsubscribe = subscribeToAuthSession((nextSession) => {
      setSession(nextSession);
      setAuthStatus(nextSession ? "checking" : "unauthenticated");

      if (!nextSession) {
        setMfaStatus(null);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;
    const userId = session.user.id;

    async function checkAdmin() {
      const resolution = await resolveAdminAccess(userId);

      if (cancelled) {
        return;
      }

      if (resolution.status === "unauthorized") {
        setMfaStatus(null);
        redirectToUnauthorizedLogin();
        return;
      }

      if (resolution.status === "error") {
        setMfaStatus(null);
        setAuthStatus("error");
        return;
      }

      setMfaStatus(resolution.mfaStatus);
      setAuthStatus("admin");
    }

    void checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return {
    session,
    authStatus,
    mfaStatus,
    isLoading: authStatus === "loading" || authStatus === "checking",
  };
}
