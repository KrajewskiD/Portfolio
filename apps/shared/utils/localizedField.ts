import type { Language } from "../database/types/language";

export function getLocalizedField<
  T extends Record<string, unknown>,
  PlKey extends keyof T,
  EnKey extends keyof T,
>(
  source: T,
  language: Language,
  plKey: PlKey,
  enKey: EnKey,
): T[PlKey] | T[EnKey] {
  return language === "pl" ? source[plKey] : source[enKey];
}

export function getLocalizedKey<T extends string>(
  language: Language,
  plKey: T,
  enKey: T,
): T {
  return language === "pl" ? plKey : enKey;
}

export function getOppositeLocalizedKey<T extends string>(
  language: Language,
  plKey: T,
  enKey: T,
): T {
  return language === "pl" ? enKey : plKey;
}

export function getOppositeLanguage(language: Language): Language {
  return language === "pl" ? "en" : "pl";
}
