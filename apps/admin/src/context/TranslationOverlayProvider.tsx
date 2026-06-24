import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import { TranslationOverlayContext } from "@admin/context/translationOverlayContext";
import type { TranslationOverlayState } from "@admin/context/translationOverlayTypes";
import { cancelActiveTranslation } from "@admin/services/translationService";

export function TranslationOverlayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [overlayState, setOverlayState] =
    useState<TranslationOverlayState | null>(null);
  const isActiveRef = useRef(false);

  const beginTranslation = useCallback(() => {
    isActiveRef.current = true;
    setOverlayState({ phase: "loading" });
  }, []);

  const finishTranslationSuccess = useCallback((message: string) => {
    if (!isActiveRef.current) {
      return;
    }

    isActiveRef.current = false;
    setOverlayState({ phase: "success", message });
  }, []);

  const finishTranslationError = useCallback((message: string) => {
    if (!isActiveRef.current) {
      return;
    }

    isActiveRef.current = false;
    setOverlayState({ phase: "error", message });
  }, []);

  const dismissTranslation = useCallback(() => {
    isActiveRef.current = false;
    setOverlayState(null);
  }, []);

  const cancelTranslation = useCallback(() => {
    isActiveRef.current = false;
    cancelActiveTranslation();
    setOverlayState(null);
  }, []);

  const isOverlayOpen = overlayState !== null;

  const value = useMemo(
    () => ({
      overlayState,
      isOverlayOpen,
      beginTranslation,
      finishTranslationSuccess,
      finishTranslationError,
      cancelTranslation,
      dismissTranslation,
    }),
    [
      beginTranslation,
      cancelTranslation,
      dismissTranslation,
      finishTranslationError,
      finishTranslationSuccess,
      isOverlayOpen,
      overlayState,
    ],
  );

  return (
    <TranslationOverlayContext.Provider value={value}>
      {children}
    </TranslationOverlayContext.Provider>
  );
}
