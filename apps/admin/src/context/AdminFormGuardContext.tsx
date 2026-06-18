import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import AdminUnsavedChangesDialog, {
  type UnsavedChangesDecision,
} from "@admin/components/ui/AdminUnsavedChangesDialog";

export type AdminFormGuardRegistration = {
  isDirty: boolean;
  save: () => Promise<boolean>;
  discard: () => void;
};

type AdminFormGuardContextValue = {
  registerForm: (registration: AdminFormGuardRegistration) => void;
  clearForm: () => void;
  confirmNavigation: () => Promise<boolean>;
};

const AdminFormGuardContext = createContext<AdminFormGuardContextValue | null>(
  null,
);

export function AdminFormGuardProvider({ children }: { children: ReactNode }) {
  const registrationRef = useRef<AdminFormGuardRegistration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const decisionResolverRef = useRef<
    ((decision: UnsavedChangesDecision) => void) | null
  >(null);

  const registerForm = useCallback(
    (registration: AdminFormGuardRegistration) => {
      registrationRef.current = registration;
    },
    [],
  );

  const clearForm = useCallback(() => {
    registrationRef.current = null;
  }, []);

  const askForDecision = useCallback(() => {
    return new Promise<UnsavedChangesDecision>((resolve) => {
      decisionResolverRef.current = resolve;
      setIsDialogOpen(true);
    });
  }, []);

  const handleDecision = useCallback((decision: UnsavedChangesDecision) => {
    setIsDialogOpen(false);
    decisionResolverRef.current?.(decision);
    decisionResolverRef.current = null;
  }, []);

  const confirmNavigation = useCallback(async () => {
    const registration = registrationRef.current;

    if (!registration?.isDirty) {
      return true;
    }

    const decision = await askForDecision();

    if (decision === "cancel") {
      return false;
    }

    if (decision === "discard") {
      registration.discard();
      return true;
    }

    return registration.save();
  }, [askForDecision]);

  const value = useMemo(
    () => ({
      registerForm,
      clearForm,
      confirmNavigation,
    }),
    [clearForm, confirmNavigation, registerForm],
  );

  return (
    <AdminFormGuardContext.Provider value={value}>
      {children}
      <AdminUnsavedChangesDialog
        isOpen={isDialogOpen}
        onDecision={handleDecision}
      />
    </AdminFormGuardContext.Provider>
  );
}

export function useAdminFormGuard() {
  const context = useContext(AdminFormGuardContext);

  if (!context) {
    throw new Error(
      "useAdminFormGuard must be used within AdminFormGuardProvider",
    );
  }

  return context;
}
