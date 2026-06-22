import { useEffect } from "react";

import {
  useAdminFormGuard,
  type AdminFormGuardRegistration,
} from "@admin/context/useAdminFormGuard";

export function useRegisterAdminForm({
  discard,
  isDirty,
  save,
}: AdminFormGuardRegistration) {
  const { registerForm, clearForm } = useAdminFormGuard();

  useEffect(() => {
    registerForm({ discard, isDirty, save });
  }, [discard, isDirty, registerForm, save]);

  useEffect(() => {
    return () => {
      clearForm();
    };
  }, [clearForm]);
}
