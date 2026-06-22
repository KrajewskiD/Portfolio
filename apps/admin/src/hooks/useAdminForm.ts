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
  const discardSavedValue = saveHook.discard;
  const isDirty = saveHook.isDirty || extraDirty;

  const discard = useCallback(() => {
    discardSavedValue();
    onDiscard?.();
  }, [discardSavedValue, onDiscard]);

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
