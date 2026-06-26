import { getFooterLinksFromDatabase } from "@shared/database";

import { supabase } from "../lib/supabase";
import { getWithLocalStorageCache } from "../utils/localStorageCache";
import {
  PUBLIC_CONTENT_CACHE_TTL_MS,
  publicContentCacheKeys,
} from "../utils/publicContentCache";
import { isValidFooterLinks } from "../utils/publicContentCacheValidators";

export function getFooterLinks() {
  return getWithLocalStorageCache(
    publicContentCacheKeys.footerLinks,
    PUBLIC_CONTENT_CACHE_TTL_MS,
    () => getFooterLinksFromDatabase(supabase),
    { validate: isValidFooterLinks },
  );
}
