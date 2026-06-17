import {
  getProjectsFromDatabase,
  PROJECT_IMAGES_BUCKET,
  getStoragePublicUrl,
} from "@shared/database";

import { supabase } from "../lib/supabase";

function getProjectImagePublicUrl(path: string): string {
  return getStoragePublicUrl(supabase, PROJECT_IMAGES_BUCKET, path);
}

export function getProjects() {
  return getProjectsFromDatabase(supabase, getProjectImagePublicUrl);
}
