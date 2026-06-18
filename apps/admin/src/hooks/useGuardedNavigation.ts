import { useCallback } from "react";

export function useGuardedNavigation(
  confirmNavigation: () => Promise<boolean>,
) {
  return useCallback(
    <T extends unknown[]>(
      action: (...args: T) => void | Promise<void>,
      shouldProceed?: (...args: T) => boolean,
    ) =>
      async (...args: T) => {
        if (shouldProceed && !shouldProceed(...args)) {
          return;
        }

        if (await confirmNavigation()) {
          await action(...args);
        }
      },
    [confirmNavigation],
  );
}
