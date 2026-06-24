import { PROJECT_TITLE_MAX_LENGTH } from "@shared/constants/project";
import type {
  Project,
  ProjectTechnology,
  ProjectTopicId,
} from "@shared/database/types/project";

import type { ProjectTextField, TopicTextField } from "./projectEditorTypes";

function mapProjectById(
  projects: Project[],
  projectId: string,
  updater: (project: Project) => Project,
): Project[] {
  return projects.map((project) =>
    project.id === projectId ? updater(project) : project,
  );
}

export function updateProjectFieldValue(
  project: Project,
  field: ProjectTextField,
  value: string,
): Project {
  const nextValue =
    field === "titlePl" || field === "titleEn"
      ? value.slice(0, PROJECT_TITLE_MAX_LENGTH)
      : value;

  return {
    ...project,
    [field]: nextValue,
  };
}

export function updateProjectTopicFieldValue(
  project: Project,
  topicId: ProjectTopicId,
  field: TopicTextField,
  value: string,
): Project {
  return {
    ...project,
    topics: project.topics.map((topic) =>
      topic.id === topicId
        ? {
            ...topic,
            [field]: value,
          }
        : topic,
    ),
  };
}

export function appendTechnologyToProject(
  project: Project,
  technology: ProjectTechnology,
): Project {
  return {
    ...project,
    technologies: [...project.technologies, technology],
  };
}

export function updateTechnologyInProject(
  project: Project,
  index: number,
  field: "name" | "iconSlug",
  value: string,
): Project {
  return {
    ...project,
    technologies: project.technologies.map((technology, technologyIndex) =>
      technologyIndex === index
        ? {
            ...technology,
            [field]: value,
          }
        : technology,
    ),
  };
}

export function removeTechnologyFromProject(
  project: Project,
  index: number,
): Project {
  return {
    ...project,
    technologies: project.technologies.filter(
      (_, technologyIndex) => technologyIndex !== index,
    ),
  };
}

export function updateProjectField(
  projects: Project[],
  projectId: string,
  field: ProjectTextField,
  value: string,
): Project[] {
  return mapProjectById(projects, projectId, (project) =>
    updateProjectFieldValue(project, field, value),
  );
}

export function updateProjectTopicField(
  projects: Project[],
  projectId: string,
  topicId: ProjectTopicId,
  field: TopicTextField,
  value: string,
): Project[] {
  return mapProjectById(projects, projectId, (project) =>
    updateProjectTopicFieldValue(project, topicId, field, value),
  );
}

export function appendProjectTechnology(
  projects: Project[],
  projectId: string,
  technology: ProjectTechnology,
): Project[] {
  return mapProjectById(projects, projectId, (project) =>
    appendTechnologyToProject(project, technology),
  );
}

export function updateProjectTechnology(
  projects: Project[],
  projectId: string,
  index: number,
  field: "name" | "iconSlug",
  value: string,
): Project[] {
  return mapProjectById(projects, projectId, (project) =>
    updateTechnologyInProject(project, index, field, value),
  );
}

export function removeProjectTechnology(
  projects: Project[],
  projectId: string,
  index: number,
): Project[] {
  return mapProjectById(projects, projectId, (project) =>
    removeTechnologyFromProject(project, index),
  );
}
