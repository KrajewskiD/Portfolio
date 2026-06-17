import { supabase } from "@admin/lib/supabase";
import type { Project } from "@shared/database/types/project";
import type { TechnologyIdRow } from "@shared/database/projects";

function uniqueTechnologyNames(technologies: string[]): string[] {
  return technologies.filter(
    (technology, index, allTechnologies) =>
      allTechnologies.findIndex(
        (item) => item.toLowerCase() === technology.toLowerCase(),
      ) === index,
  );
}

async function getOrCreateTechnologyId(name: string): Promise<string> {
  const { data: technology, error: technologyLookupError } = await supabase
    .from("technologies")
    .select("id")
    .eq("name", name)
    .maybeSingle<TechnologyIdRow>();

  if (technologyLookupError) {
    throw technologyLookupError;
  }

  if (technology) {
    return technology.id;
  }

  const { data: createdTechnology, error: technologyCreateError } =
    await supabase
      .from("technologies")
      .insert({ name })
      .select("id")
      .single<TechnologyIdRow>();

  if (technologyCreateError) {
    throw technologyCreateError;
  }

  return createdTechnology.id;
}

export async function createProject(
  project: Project,
  displayOrder: number,
): Promise<void> {
  const { error } = await supabase.from("projects").upsert({
    id: project.id,
    code: project.code ?? null,
    title_pl: project.titlePl,
    title_en: project.titleEn,
    display_order: displayOrder,
  });

  if (error) {
    throw error;
  }
}

export async function updateProject(
  project: Project,
  displayOrder: number,
): Promise<void> {
  await createProject(project, displayOrder);
}

export async function saveProjectTopics(project: Project): Promise<void> {
  for (const topic of project.topics) {
    const { error } = await supabase.from("project_topics").upsert(
      {
        project_id: project.id,
        topic_type_id: topic.id,
        content_pl: topic.contentPl,
        content_en: topic.contentEn,
        image_path: topic.imagePath ?? null,
        image_alt_pl: topic.imageAltPl,
        image_alt_en: topic.imageAltEn,
      },
      { onConflict: "project_id,topic_type_id" },
    );

    if (error) {
      throw error;
    }
  }
}

export async function saveProjectTechnologies(
  project: Project,
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", project.id);

  if (deleteError) {
    throw deleteError;
  }

  const technologies = uniqueTechnologyNames(project.technologies);

  if (technologies.length === 0) {
    return;
  }

  const rows = await Promise.all(
    technologies.map(async (technology, index) => ({
      project_id: project.id,
      technology_id: await getOrCreateTechnologyId(technology),
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
