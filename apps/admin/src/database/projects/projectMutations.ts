import { deleteProjectImages, deleteProjectVideos } from "@admin/lib/imageStorage";
import { supabase } from "@admin/lib/supabase";
import { getOrCreateTechnologyId } from "@shared/database";
import {
  mapProjectToRow,
  mapProjectTopicToRow,
} from "@shared/database/projects/projectMapper";
import type {
  Project,
  ProjectTechnology,
} from "@shared/database/types/project";

function uniqueTechnologies(
  technologies: ProjectTechnology[],
): ProjectTechnology[] {
  const seen = new Set<string>();

  return technologies.flatMap((technology) => {
    const name = technology.name.trim();

    if (!name) {
      return [];
    }

    const key = name.toLowerCase();

    if (seen.has(key)) {
      return [];
    }

    seen.add(key);

    return [
      {
        name,
        iconSlug: technology.iconSlug.trim(),
      },
    ];
  });
}

async function upsertProjectRow(
  project: Project,
  displayOrder: number,
): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .upsert(mapProjectToRow(project, displayOrder));

  if (error) {
    throw error;
  }
}

export async function updateProject(
  project: Project,
  displayOrder: number,
): Promise<void> {
  await upsertProjectRow(project, displayOrder);
}

export async function saveProjectTopics(project: Project): Promise<void> {
  for (const topic of project.topics) {
    const { error } = await supabase
      .from("project_topics")
      .upsert(mapProjectTopicToRow(project.id, topic), {
        onConflict: "project_id,topic_type_id",
      });

    if (error) {
      throw error;
    }
  }
}

export async function saveProjectTechnologies(project: Project): Promise<void> {
  const { error: deleteError } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", project.id);

  if (deleteError) {
    throw deleteError;
  }

  const technologies = uniqueTechnologies(project.technologies);

  if (technologies.length === 0) {
    return;
  }

  const rows = await Promise.all(
    technologies.map(async (technology, index) => ({
      project_id: project.id,
      technology_id: await getOrCreateTechnologyId(
        supabase,
        technology.name,
        technology.iconSlug,
      ),
      display_order: index + 1,
    })),
  );

  const { error: insertError } = await supabase
    .from("project_technologies")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  await deleteProjectImages(projectId);
  await deleteProjectVideos(projectId);

  const { error: technologiesError } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", projectId);

  if (technologiesError) {
    throw technologiesError;
  }

  const { error: topicsError } = await supabase
    .from("project_topics")
    .delete()
    .eq("project_id", projectId);

  if (topicsError) {
    throw topicsError;
  }

  const { error: projectError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (projectError) {
    throw projectError;
  }
}
