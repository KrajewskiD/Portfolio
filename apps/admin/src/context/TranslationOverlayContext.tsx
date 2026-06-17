import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cancelActiveTranslation } from "@admin/services/translationService";

export type TranslationOverlayState =
  | { phase: "loading" }
  | { phase: "success"; message: string }
  | { phase: "error"; message: string };

type TranslationOverlayContextValue = {
  overlayState: TranslationOverlayState | null;
  isOverlayOpen: boolean;
  beginTranslation: () => void;
  finishTranslationSuccess: (message: string) => void;
  finishTranslationError: (message: string) => void;
  cancelTranslation: () => void;
  dismissTranslation: () => void;
};

const TranslationOverlayContext =
  createContext<TranslationOverlayContextValue | null>(null);

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

export function useTranslationOverlay() {
  const context = useContext(TranslationOverlayContext);

  if (!context) {
    throw new Error(
      "useTranslationOverlay must be used within TranslationOverlayProvider",
    );
  }

  return context;
}
