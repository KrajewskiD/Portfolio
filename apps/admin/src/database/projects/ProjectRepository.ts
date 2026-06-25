import {
  deleteProjectImages,
  deleteProjectMiniatures,
  getProjectImagePublicUrl,
  getProjectMiniaturePublicUrl,
} from "@admin/lib/imageStorage";
import { supabase } from "@admin/lib/supabase";
import {
  getProjectsFromDatabase,
  hydrateProjectImages,
} from "@shared/database";
import type { Project } from "@shared/database/types/project";

import {
  cleanupDeletedProjectMedia,
  deleteProjectData,
} from "./projectMutations";

const projectMediaCleaner = {
  deleteProjectImages,
  deleteProjectMiniatures,
};

export async function getAdminProjects(): Promise<Project[]> {
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

export async function saveAdminProjects(projects: Project[]): Promise<void> {
  const { error } = await supabase.rpc("save_admin_projects", {
    projects_payload: projects,
  });

  if (error) {
    throw error;
  }
}

export async function deleteAdminProject(projectId: string): Promise<void> {
  await deleteProjectData(supabase, projectId);
  await cleanupDeletedProjectMedia(projectId, projectMediaCleaner);
}
