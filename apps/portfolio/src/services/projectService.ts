import {
  getProjectsFromDatabase,
  hydrateProjectImages,
  PROJECT_IMAGES_BUCKET,
  PROJECT_MINIATURES_BUCKET,
  PROJECT_VIDEOS_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";

import { supabase } from "../lib/supabase";

const getProjectImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_IMAGES_BUCKET,
);

const getProjectVideoPublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_VIDEOS_BUCKET,
);

const getProjectMiniaturePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_MINIATURES_BUCKET,
);

export async function getProjects() {
  const projects = await getProjectsFromDatabase(
    supabase,
    getProjectImagePublicUrl,
    getProjectVideoPublicUrl,
    getProjectMiniaturePublicUrl,
  );

  return hydrateProjectImages(supabase, projects, {
    getProjectImagePublicUrl,
    getProjectMiniaturePublicUrl,
  });
}
