import {
  deleteProjectImages,
  deleteProjectMiniatures,
} from "@admin/lib/imageStorage";
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

type ProjectTechnologyRelationRow = {
  technology_id: string;
};

type ProjectTechnologyRow = ProjectTechnologyRelationRow & {
  display_order: number;
  project_id: string;
};

type ProjectTechnologySyncPlan = {
  obsoleteTechnologyIds: string[];
  rowsToInsert: ProjectTechnologyRow[];
  rowsToUpdate: ProjectTechnologyRow[];
};

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

async function deleteAllProjectTechnologies(projectId: string): Promise<void> {
  const { error } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }
}

async function loadProjectTechnologyRelations(
  projectId: string,
): Promise<ProjectTechnologyRelationRow[]> {
  const { data: existingRows, error } = await supabase
    .from("project_technologies")
    .select("technology_id")
    .eq("project_id", projectId)
    .overrideTypes<ProjectTechnologyRelationRow[]>();

  if (error) {
    throw error;
  }

  return existingRows ?? [];
}

async function createProjectTechnologyRows(
  projectId: string,
  technologies: ProjectTechnology[],
): Promise<ProjectTechnologyRow[]> {
  return Promise.all(
    technologies.map(async (technology, index) => ({
      project_id: projectId,
      technology_id: await getOrCreateTechnologyId(
        supabase,
        technology.name,
        technology.iconSlug,
      ),
      display_order: index + 1,
    })),
  );
}

function createProjectTechnologySyncPlan(
  rows: ProjectTechnologyRow[],
  existingRows: ProjectTechnologyRelationRow[],
): ProjectTechnologySyncPlan {
  const existingTechnologyIds = new Set(
    existingRows.map((row) => row.technology_id),
  );
  const rowsToInsert = rows.filter(
    (row) => !existingTechnologyIds.has(row.technology_id),
  );
  const rowsToUpdate = rows.filter((row) =>
    existingTechnologyIds.has(row.technology_id),
  );
  const nextTechnologyIds = new Set(rows.map((row) => row.technology_id));
  const obsoleteTechnologyIds = existingRows
    .map((row) => row.technology_id)
    .filter((technologyId) => !nextTechnologyIds.has(technologyId));

  return {
    obsoleteTechnologyIds,
    rowsToInsert,
    rowsToUpdate,
  };
}

async function insertProjectTechnologyRows(
  rowsToInsert: ProjectTechnologyRow[],
): Promise<void> {
  if (rowsToInsert.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("project_technologies")
    .insert(rowsToInsert);

  if (error) {
    throw error;
  }
}

async function updateProjectTechnologyRows(
  rowsToUpdate: ProjectTechnologyRow[],
): Promise<void> {
  for (const row of rowsToUpdate) {
    const { error } = await supabase
      .from("project_technologies")
      .update({ display_order: row.display_order })
      .eq("project_id", row.project_id)
      .eq("technology_id", row.technology_id);

    if (error) {
      throw error;
    }
  }
}

async function deleteObsoleteProjectTechnologyRows(
  projectId: string,
  obsoleteTechnologyIds: string[],
): Promise<void> {
  if (obsoleteTechnologyIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", projectId)
    .in("technology_id", obsoleteTechnologyIds);

  if (error) {
    throw error;
  }
}

async function applyProjectTechnologySyncPlan(
  projectId: string,
  syncPlan: ProjectTechnologySyncPlan,
): Promise<void> {
  await insertProjectTechnologyRows(syncPlan.rowsToInsert);
  await updateProjectTechnologyRows(syncPlan.rowsToUpdate);
  await deleteObsoleteProjectTechnologyRows(
    projectId,
    syncPlan.obsoleteTechnologyIds,
  );
}

export async function saveProjectTechnologies(project: Project): Promise<void> {
  const technologies = uniqueTechnologies(project.technologies);

  if (technologies.length === 0) {
    await deleteAllProjectTechnologies(project.id);
    return;
  }

  const existingRows = await loadProjectTechnologyRelations(project.id);
  const rows = await createProjectTechnologyRows(project.id, technologies);
  const syncPlan = createProjectTechnologySyncPlan(rows, existingRows);

  await applyProjectTechnologySyncPlan(project.id, syncPlan);
}

export async function deleteProject(projectId: string): Promise<void> {
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

  try {
    await deleteProjectImages(projectId);
    await deleteProjectMiniatures(projectId);
  } catch (error) {
    console.error("Project deleted but storage cleanup failed:", error);
  }
}
