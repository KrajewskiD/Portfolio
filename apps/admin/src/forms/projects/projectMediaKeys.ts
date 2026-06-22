import type { ProjectTopicId } from "@shared/database/types/project";

export function topicImageKey(projectId: string, topicId: ProjectTopicId) {
  return `${projectId}:${topicId}`;
}

export function projectVideoKey(projectId: string) {
  return `${projectId}:video`;
}

export function projectMiniatureKey(projectId: string) {
  return `${projectId}:miniature`;
}
