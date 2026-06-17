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
