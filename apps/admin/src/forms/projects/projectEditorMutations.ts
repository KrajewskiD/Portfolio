import { PROJECT_TITLE_MAX_LENGTH } from "@shared/constants/project";
import type {
  Project,
  ProjectTechnology,
  ProjectTopicId,
} from "@shared/database/types/project";

import type { ProjectTextField, TopicTextField } from "./projectEditorTypes";

export function mapProjectById(
  projects: Project[],
  projectId: string,
  updater: (project: Project) => Project,
): Project[] {
  return projects.map((project) =>
    project.id === projectId ? updater(project) : project,
  );
}

export function updateProjectField(
  projects: Project[],
  projectId: string,
  field: ProjectTextField,
  value: string,
): Project[] {
  const nextValue =
    field === "titlePl" || field === "titleEn"
      ? value.slice(0, PROJECT_TITLE_MAX_LENGTH)
      : value;

  return mapProjectById(projects, projectId, (project) => ({
    ...project,
    [field]: nextValue,
  }));
}

export function updateProjectTopicField(
  projects: Project[],
  projectId: string,
  topicId: ProjectTopicId,
  field: TopicTextField,
  value: string,
): Project[] {
  return mapProjectById(projects, projectId, (project) => ({
    ...project,
    topics: project.topics.map((topic) =>
      topic.id === topicId
        ? {
            ...topic,
            [field]: value,
          }
        : topic,
    ),
  }));
}

export function appendProjectTechnology(
  projects: Project[],
  projectId: string,
  technology: ProjectTechnology,
): Project[] {
  return mapProjectById(projects, projectId, (project) => ({
    ...project,
    technologies: [...project.technologies, technology],
  }));
}

export function updateProjectTechnology(
  projects: Project[],
  projectId: string,
  index: number,
  field: "name" | "iconSlug",
  value: string,
): Project[] {
  return mapProjectById(projects, projectId, (project) => ({
    ...project,
    technologies: project.technologies.map((technology, technologyIndex) =>
      technologyIndex === index
        ? {
            ...technology,
            [field]: value,
          }
        : technology,
    ),
  }));
}

export function removeProjectTechnology(
  projects: Project[],
  projectId: string,
  index: number,
): Project[] {
  return mapProjectById(projects, projectId, (project) => ({
    ...project,
    technologies: project.technologies.filter(
      (_, technologyIndex) => technologyIndex !== index,
    ),
  }));
}
