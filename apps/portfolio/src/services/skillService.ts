import { getSkillGroupsFromDatabase } from "@shared/database";

import { supabase } from "../lib/supabase";
import { getWithLocalStorageCache } from "../utils/localStorageCache";
import {
  PUBLIC_CONTENT_CACHE_TTL_MS,
  publicContentCacheKeys,
} from "../utils/publicContentCache";
import { isValidSkillGroups } from "../utils/publicContentCacheValidators";

export function getSkillGroups() {
  return getWithLocalStorageCache(
    publicContentCacheKeys.skillGroups,
    PUBLIC_CONTENT_CACHE_TTL_MS,
    () => getSkillGroupsFromDatabase(supabase),
    { validate: isValidSkillGroups },
  );
}
