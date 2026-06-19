import type { SupabaseClient } from "@supabase/supabase-js";

import type { Project } from "../types/project";
import { mapProjectRow } from "./projectMapper";
import type { ProjectRow } from "./projectRows";

export async function getProjectsFromDatabase(
  supabase: SupabaseClient,
  getProjectImagePublicUrl: (path: string) => string,
  getProjectVideoPublicUrl: (path: string) => string = getProjectImagePublicUrl,
  getProjectMiniaturePublicUrl: (
    path: string,
  ) => string = getProjectImagePublicUrl,
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      code,
      project_url,
      title_pl,
      title_en,
      display_order,
      miniature_path,
      video_path,
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
          name,
          icon_slug
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
    mapProjectRow(
      project,
      getProjectImagePublicUrl,
      getProjectVideoPublicUrl,
      getProjectMiniaturePublicUrl,
    ),
  );
}
