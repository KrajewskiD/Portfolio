import { useContext } from "react";

import { TranslationOverlayContext } from "@admin/context/translationOverlayContext";

export function useTranslationOverlay() {
  const context = useContext(TranslationOverlayContext);

  if (!context) {
    throw new Error(
      "useTranslationOverlay must be used within TranslationOverlayProvider",
    );
  }

  return context;
}
