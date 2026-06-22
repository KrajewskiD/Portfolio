export type TranslationOverlayState =
  | { phase: "loading" }
  | { phase: "success"; message: string }
  | { phase: "error"; message: string };

export type TranslationOverlayContextValue = {
  overlayState: TranslationOverlayState | null;
  isOverlayOpen: boolean;
  beginTranslation: () => void;
  finishTranslationSuccess: (message: string) => void;
  finishTranslationError: (message: string) => void;
  cancelTranslation: () => void;
  dismissTranslation: () => void;
};
