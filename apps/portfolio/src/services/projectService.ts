import { projectTopicOrder } from "@shared/constants/projectTopics";
import { supabase } from "../lib/supabase";
import type {
  Project,
  ProjectTopicContent,
  ProjectTopicId,
} from "@shared/types/project";

type ProjectRow = {
  id: string;
  code: string | null;
  title_pl: string;
  title_en: string;
  display_order: number;
  project_topics: {
    topic_type_id: string;
    content_pl: string;
    content_en: string;
    image_path: string | null;
    image_alt_pl: string | null;
    image_alt_en: string | null;
  }[];
  project_technologies: {
    display_order: number;
    technologies: {
      name: string;
    } | null;
  }[];
};

function isProjectTopicId(value: string): value is ProjectTopicId {
  return projectTopicOrder.includes(value as ProjectTopicId);
}

export async function getProjects(): Promise<Project[]> {
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

  return data.map((project) => {
    const topics: ProjectTopicContent[] = project.project_topics
      .filter((topic) => isProjectTopicId(topic.topic_type_id))
      .map((topic) => ({
        id: topic.topic_type_id as ProjectTopicId,
        contentPl: topic.content_pl,
        contentEn: topic.content_en,
        imageUrl: topic.image_path
          ? supabase.storage
              .from("project-images")
              .getPublicUrl(topic.image_path).data.publicUrl
          : undefined,
        imageAltPl: topic.image_alt_pl ?? "",
        imageAltEn: topic.image_alt_en ?? "",
      }))
      .sort(
        (first, second) =>
          projectTopicOrder.indexOf(first.id) -
          projectTopicOrder.indexOf(second.id),
      );

    const technologies = project.project_technologies
      .toSorted((first, second) => first.display_order - second.display_order)
      .flatMap((item) => (item.technologies ? [item.technologies.name] : []));

    return {
      id: project.id,
      code: project.code ?? undefined,
      titlePl: project.title_pl,
      titleEn: project.title_en,
      technologies,
      topics,
    };
  });
}
