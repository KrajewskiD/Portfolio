import { getProjectImagePublicUrl } from "@admin/lib/imageStorage";
import { supabase } from "@admin/lib/supabase";
import { getProjectsFromDatabase } from "@shared/database/projects";
import type { Project } from "@shared/database/types/project";

import {
  deleteProject as deleteProjectRow,
  saveProjectTechnologies,
  saveProjectTopics,
  updateProject,
} from "./projectMutations";

export function getAdminProjects(): Promise<Project[]> {
  return getProjectsFromDatabase(supabase, getProjectImagePublicUrl);
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
