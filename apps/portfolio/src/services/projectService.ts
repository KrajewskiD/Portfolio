import { getProjectsFromDatabase } from "@shared/database/projects";

import { supabase } from "../lib/supabase";

function getProjectImagePublicUrl(path: string): string {
  return supabase.storage.from("project-images").getPublicUrl(path).data
    .publicUrl;
}

export function getProjects() {
  return getProjectsFromDatabase(supabase, getProjectImagePublicUrl);
}
