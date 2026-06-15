import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getMfaStatus, type MfaStatus } from "../services/mfaService";

type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "checking"
  | "admin"
  | "forbidden";

type AuthContextValue = {
  session: Session | null;
  isAdmin: boolean;
  mfaStatus: MfaStatus | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? "checking" : "unauthenticated");

      if (!nextSession) {
        setMfaStatus(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    async function checkAdmin() {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session!.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setMfaStatus(null);
        setStatus("forbidden");
        return;
      }

      try {
        const nextMfaStatus = await getMfaStatus();

        if (cancelled) return;

        setMfaStatus(nextMfaStatus);
        setStatus("admin");
      } catch {
        if (cancelled) return;

        setMfaStatus(null);
        setStatus("forbidden");
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
        isAdmin: status === "admin",
        mfaStatus,
        isLoading: status === "loading" || status === "checking",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
