import { supabase } from "@admin/lib/supabase";
import {
  getProjectImagePublicUrl,
  uploadProjectTopicImage,
} from "@admin/lib/imageStorage";
import {
  normalizeProjectTopics,
  projectTopicOrder,
} from "@shared/constants/projectTopics";
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

function mapProjectRow(project: ProjectRow): Project {
  const topics: ProjectTopicContent[] = project.project_topics
    .filter((topic) => isProjectTopicId(topic.topic_type_id))
    .map((topic) => {
      const imagePath = topic.image_path ?? undefined;
      const imageUrl = imagePath
        ? getProjectImagePublicUrl(imagePath)
        : undefined;

      return {
        id: topic.topic_type_id as ProjectTopicId,
        contentPl: topic.content_pl,
        contentEn: topic.content_en,
        imagePath,
        imageUrl,
        imageAltPl: topic.image_alt_pl ?? "",
        imageAltEn: topic.image_alt_en ?? "",
      };
    })
    .sort(
      (first, second) =>
        projectTopicOrder.indexOf(first.id) -
        projectTopicOrder.indexOf(second.id),
    );

  const technologies = project.project_technologies
    .toSorted((first, second) => first.display_order - second.display_order)
    .flatMap((item) => (item.technologies ? [item.technologies.name] : []));

  return normalizeProjectTopics({
    id: project.id,
    code: project.code ?? undefined,
    titlePl: project.title_pl,
    titleEn: project.title_en,
    technologies,
    topics,
  });
}

export async function getAdminProjects(): Promise<Project[]> {
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

  return data.map(mapProjectRow);
}

export async function saveAdminProjects(projects: Project[]): Promise<void> {
  for (const [index, project] of projects.entries()) {
    const { error: projectError } = await supabase.from("projects").upsert({
      id: project.id,
      code: project.code ?? null,
      title_pl: project.titlePl,
      title_en: project.titleEn,
      display_order: index + 1,
    });

    if (projectError) {
      throw projectError;
    }

    for (const topic of project.topics) {
      const { error: topicError } = await supabase
        .from("project_topics")
        .upsert(
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

      if (topicError) {
        throw topicError;
      }
    }
  }
}

export { uploadProjectTopicImage, getProjectImagePublicUrl };
