import {
  getProjectsFromDatabase,
  PROJECT_IMAGES_BUCKET,
  createBucketUrlResolver,
} from "@shared/database";

import { supabase } from "../lib/supabase";

const getProjectImagePublicUrl = createBucketUrlResolver(
  supabase,
  PROJECT_IMAGES_BUCKET,
);

export function getProjects() {
  return getProjectsFromDatabase(supabase, getProjectImagePublicUrl);
}
