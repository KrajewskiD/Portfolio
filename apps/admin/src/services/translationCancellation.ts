export class TranslationCancelledError extends Error {
  constructor() {
    super("Translation cancelled");
    this.name = "TranslationCancelledError";
  }
}

export function isTranslationCancelledError(
  error: unknown,
): error is TranslationCancelledError {
  return error instanceof TranslationCancelledError;
}

let activeTranslationCancel: (() => void) | null = null;
let activeAbortController: AbortController | null = null;

export function cancelActiveTranslation() {
  activeTranslationCancel?.();
  activeAbortController?.abort();
  activeTranslationCancel = null;
  activeAbortController = null;
}

function registerTranslationCancel(onCancel: () => void) {
  activeTranslationCancel = onCancel;
}

function clearTranslationCancel(onCancel: () => void) {
  if (activeTranslationCancel === onCancel) {
    activeTranslationCancel = null;
  }
}

export function beginTranslationCancellation() {
  const abortController = new AbortController();
  activeAbortController = abortController;

  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    abortController.abort();
  };

  registerTranslationCancel(cancel);

  return {
    signal: abortController.signal,
    isCancelled: () => cancelled || abortController.signal.aborted,
    dispose: () => {
      clearTranslationCancel(cancel);

      if (activeAbortController === abortController) {
        activeAbortController = null;
      }
    },
  };
}
