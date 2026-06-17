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
