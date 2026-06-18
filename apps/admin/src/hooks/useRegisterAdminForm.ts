import { useEffect } from "react";

import {
  useAdminFormGuard,
  type AdminFormGuardRegistration,
} from "@admin/context/AdminFormGuardContext";

export function useRegisterAdminForm(registration: AdminFormGuardRegistration) {
  const { registerForm, clearForm } = useAdminFormGuard();

  useEffect(() => {
    registerForm(registration);
  }, [
    registerForm,
    registration.discard,
    registration.isDirty,
    registration.save,
  ]);

  useEffect(() => {
    return () => {
      clearForm();
    };
  }, [clearForm]);
}
