import { useCallback, useState } from "react";

import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import { isTranslationCancelledError } from "@admin/services/translationService";

type RunTranslationOptions = {
  disabled?: boolean;
  validate?: () => string | undefined;
  execute: () => Promise<void>;
  successMessage: string;
  fallbackError: string;
};

export function useTranslationRunner() {
  const { beginTranslation, finishTranslationSuccess, finishTranslationError } =
    useTranslationOverlay();
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string>();

  const run = useCallback(
    async ({
      disabled = false,
      validate,
      execute,
      successMessage,
      fallbackError,
    }: RunTranslationOptions) => {
      if (disabled || isTranslating) {
        return;
      }

      const validationError = validate?.();

      if (validationError) {
        setError(validationError);
        return;
      }

      setIsTranslating(true);
      setError(undefined);
      beginTranslation();

      try {
        await execute();
        finishTranslationSuccess(successMessage);
      } catch (err) {
        if (isTranslationCancelledError(err)) {
          return;
        }

        finishTranslationError(
          err instanceof Error ? err.message : fallbackError,
        );
      } finally {
        setIsTranslating(false);
      }
    },
    [
      beginTranslation,
      finishTranslationError,
      finishTranslationSuccess,
      isTranslating,
    ],
  );

  return { run, isTranslating, error };
}
