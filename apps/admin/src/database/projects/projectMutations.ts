import type { SupabaseClient } from "@supabase/supabase-js";

export type ProjectMediaCleaner = {
  deleteProjectImages: (projectId: string) => Promise<void>;
  deleteProjectMiniatures: (projectId: string) => Promise<void>;
};

export async function deleteProjectData(
  supabase: SupabaseClient,
  projectId: string,
): Promise<void> {
  const { error } = await supabase.rpc("delete_admin_project", {
    project_id_to_delete: projectId,
  });

  if (error) {
    throw error;
  }
}

export async function cleanupDeletedProjectMedia(
  projectId: string,
  cleaner: ProjectMediaCleaner,
): Promise<void> {
  try {
    await cleaner.deleteProjectImages(projectId);
    await cleaner.deleteProjectMiniatures(projectId);
  } catch (error) {
    console.error("Project deleted but storage cleanup failed:", error);
  }
}
