import { useCallback } from "react";

import {
  useAdminFormSave,
  type UseAdminFormSaveOptions,
} from "@admin/hooks/useAdminFormSave";
import { useRegisterAdminForm } from "@admin/hooks/useRegisterAdminForm";

type UseAdminFormOptions<T> = UseAdminFormSaveOptions<T> & {
  extraDirty?: boolean;
  onDiscard?: () => void;
};

export function useAdminForm<T>({
  extraDirty = false,
  onDiscard,
  ...saveOptions
}: UseAdminFormOptions<T>) {
  const saveHook = useAdminFormSave<T>(saveOptions);
  const isDirty = saveHook.isDirty || extraDirty;

  const discard = useCallback(() => {
    saveHook.discard();
    onDiscard?.();
  }, [onDiscard, saveHook.discard]);

  useRegisterAdminForm({
    isDirty,
    save: saveHook.save,
    discard,
  });

  return {
    ...saveHook,
    isDirty,
    discard,
  };
}
