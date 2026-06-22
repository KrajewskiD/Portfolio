import { createContext } from "react";

import type { TranslationOverlayContextValue } from "@admin/context/translationOverlayTypes";

export const TranslationOverlayContext =
  createContext<TranslationOverlayContextValue | null>(null);
