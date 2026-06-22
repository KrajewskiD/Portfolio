import {
  getProjectsFromDatabase,
  hydrateProjectImages,
  PROJECT_IMAGES_BUCKET,
  PROJECT_MINIATURES_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";

import { supabase } from "../lib/supabase";

const getProjectImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_IMAGES_BUCKET,
);

const getProjectMiniaturePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_MINIATURES_BUCKET,
);

export async function getProjects() {
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
