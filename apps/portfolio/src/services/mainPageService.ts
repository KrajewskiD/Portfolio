import { getMainPageFromDatabase } from "@shared/database/mainPage";
import type { MainPage } from "@shared/database/types/mainPage";

import { supabase } from "../lib/supabase";
import { getWithLocalStorageCache } from "../utils/localStorageCache";
import {
  PUBLIC_CONTENT_CACHE_TTL_MS,
  publicContentCacheKeys,
} from "../utils/publicContentCache";
import { isValidMainPage } from "../utils/publicContentCacheValidators";

export async function getMainPage(): Promise<MainPage> {
  return getWithLocalStorageCache(
    publicContentCacheKeys.mainPage,
    PUBLIC_CONTENT_CACHE_TTL_MS,
    () => getMainPageFromDatabase(supabase),
    { validate: isValidMainPage },
  );
}
