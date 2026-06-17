import type { SupabaseClient } from "@supabase/supabase-js";

import type { Project } from "../types/project";
import { mapProjectRow } from "./projectMapper";
import type { ProjectRow } from "./projectRows";

export async function getProjectsFromDatabase(
  supabase: SupabaseClient,
  getProjectImagePublicUrl: (path: string) => string,
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      code,
      title_pl,
      title_en,
      display_order,
      project_topics (
        topic_type_id,
        content_pl,
        content_en,
        image_path,
        image_alt_pl,
        image_alt_en
      ),
      project_technologies (
        display_order,
        technologies (
          name
        )
      )
    `,
    )
    .order("display_order", { ascending: true })
    .overrideTypes<ProjectRow[]>();

  if (error) {
    throw error;
  }

  return data.map((project) =>
    mapProjectRow(project, getProjectImagePublicUrl),
  );
}
