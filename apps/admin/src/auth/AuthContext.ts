import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";
import type { MfaStatus } from "../services/mfaService";

export type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "checking"
  | "admin"
  | "error";

export type AuthContextValue = {
  session: Session | null;
  authStatus: AuthStatus;
  mfaStatus: MfaStatus | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
