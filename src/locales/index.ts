import type { Language } from "../types/language";
import { en } from "./en";
import { pl } from "./pl";

export const translations = {
  pl,
  en,
} satisfies Record<Language, typeof pl>;
