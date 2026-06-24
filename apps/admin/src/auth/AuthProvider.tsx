import type { ReactNode } from "react";

import { useAuthState } from "@admin/hooks/auth/useAuthState";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
