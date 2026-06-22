import { createContext } from "react";

export type AdminFormGuardRegistration = {
  isDirty: boolean;
  save: () => Promise<boolean>;
  discard: () => void;
};

export type AdminFormGuardContextValue = {
  registerForm: (registration: AdminFormGuardRegistration) => void;
  clearForm: () => void;
  confirmNavigation: () => Promise<boolean>;
};

export const AdminFormGuardContext =
  createContext<AdminFormGuardContextValue | null>(null);
