import type { ProjectTopicId } from "@shared/database/types/projectTopic";

export function topicImageKey(projectId: string, topicId: ProjectTopicId) {
  return `${projectId}:${topicId}`;
}

export function projectMiniatureKey(projectId: string) {
  return projectId;
}
