import { getProjectImagePublicUrl, getProjectMiniaturePublicUrl } from "@admin/lib/imageStorage";
import { supabase } from "@admin/lib/supabase";
import { getProjectsFromDatabase, hydrateProjectImages } from "@shared/database";
import type { Project } from "@shared/database/types/project";

import {
  deleteProject as deleteProjectRow,
  saveProjectTechnologies,
  saveProjectTopics,
  updateProject,
} from "./projectMutations";

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
  for (const [index, project] of projects.entries()) {
    await updateProject(project, index + 1);
    await saveProjectTopics(project);
    await saveProjectTechnologies(project);
  }
}

export async function deleteAdminProject(projectId: string): Promise<void> {
  await deleteProjectRow(projectId);
}
