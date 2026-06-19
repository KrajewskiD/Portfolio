import {
  normalizeProjectTopics,
  projectTopicOrder,
} from "../../constants/projectTopics";
import type {
  Project,
  ProjectTopicContent,
  ProjectTopicId,
} from "../types/project";
import type { ProjectRow } from "./projectRows";

function isProjectTopicId(value: string): value is ProjectTopicId {
  return projectTopicOrder.includes(value as ProjectTopicId);
}

export function mapProjectRow(
  project: ProjectRow,
  getProjectImagePublicUrl: (path: string) => string,
  getProjectVideoPublicUrl: (path: string) => string = getProjectImagePublicUrl,
  getProjectMiniaturePublicUrl: (
    path: string,
  ) => string = getProjectImagePublicUrl,
): Project {
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
    .flatMap((item) =>
      item.technologies
        ? [
            {
              name: item.technologies.name,
              iconSlug: item.technologies.icon_slug ?? "",
            },
          ]
        : [],
    );

  const videoPath = project.video_path ?? undefined;
  const videoUrl = videoPath
    ? getProjectVideoPublicUrl(videoPath)
    : undefined;
  const miniaturePath = project.miniature_path ?? undefined;
  const miniatureUrl = miniaturePath
    ? getProjectMiniaturePublicUrl(miniaturePath)
    : undefined;

  return normalizeProjectTopics({
    id: project.id,
    code: project.code ?? undefined,
    projectUrl: project.project_url ?? undefined,
    titlePl: project.title_pl,
    titleEn: project.title_en,
    technologies,
    miniaturePath,
    miniatureUrl,
    videoPath,
    videoUrl,
    topics,
  });
}

export function mapProjectToRow(project: Project, displayOrder: number) {
  return {
    id: project.id,
    code: project.code ?? null,
    project_url: project.projectUrl?.trim() || null,
    title_pl: project.titlePl,
    title_en: project.titleEn,
    display_order: displayOrder,
    miniature_path: project.miniaturePath ?? null,
    video_path: project.videoPath ?? null,
  };
}

export function mapProjectTopicToRow(
  projectId: string,
  topic: ProjectTopicContent,
) {
  return {
    project_id: projectId,
    topic_type_id: topic.id,
    content_pl: topic.contentPl,
    content_en: topic.contentEn,
    image_path: topic.imagePath ?? null,
    image_alt_pl: topic.imageAltPl,
    image_alt_en: topic.imageAltEn,
  };
}
