import {
  getProjectsFromDatabase,
  hydrateProjectImages,
  PROJECT_IMAGES_BUCKET,
  PROJECT_MINIATURES_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";

import { supabase } from "../lib/supabase";
import { getWithLocalStorageCache } from "../utils/localStorageCache";
import {
  PUBLIC_CONTENT_CACHE_TTL_MS,
  publicContentCacheKeys,
} from "../utils/publicContentCache";
import { isValidProjects } from "../utils/publicContentCacheValidators";

const getProjectImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_IMAGES_BUCKET,
);

const getProjectMiniaturePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_MINIATURES_BUCKET,
);

async function fetchProjects() {
  const projects = await getProjectsFromDatabase(
    supabase,
    getProjectImagePublicUrl,
    getProjectMiniaturePublicUrl,
  );

  return hydrateProjectImages(supabase, projects, {
    getProjectImagePublicUrl,
    getProjectMiniaturePublicUrl,
  });
}

export async function getProjects() {
  return getWithLocalStorageCache(
    publicContentCacheKeys.projects,
    PUBLIC_CONTENT_CACHE_TTL_MS,
    fetchProjects,
    { validate: isValidProjects },
  );
}
