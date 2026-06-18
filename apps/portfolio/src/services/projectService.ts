import {
  getProjectsFromDatabase,
  PROJECT_IMAGES_BUCKET,
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

export function getProjects() {
  return getProjectsFromDatabase(
    supabase,
    getProjectImagePublicUrl,
    getProjectVideoPublicUrl,
  );
}
