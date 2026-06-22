import { useContext } from "react";

import { AdminFormGuardContext } from "@admin/context/adminFormGuardContext";

export function useAdminFormGuard() {
  const context = useContext(AdminFormGuardContext);

  if (!context) {
    throw new Error(
      "useAdminFormGuard must be used within AdminFormGuardProvider",
    );
  }

  return context;
}

export type { AdminFormGuardRegistration } from "@admin/context/adminFormGuardContext";
