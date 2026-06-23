import { useMemo } from "react";

import type { Language } from "@shared/database/types/language";

export function useLocalizedFieldState<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>(source: TSource, language: Language, plKey: TPl, enKey: TEn) {
  return useMemo(() => {
    const localizedKey = (language === "pl" ? plKey : enKey) as TPl | TEn;
    const oppositeKey = (language === "pl" ? enKey : plKey) as TPl | TEn;
    const localizedValue = source[localizedKey];

    return {
      localizedKey,
      oppositeKey,
      localizedValue,
      sourceText: localizedValue,
    };
  }, [enKey, language, plKey, source]);
}
