import type { Project, ProjectTopicContent } from "../types/project";
import type { ProjectTopicId } from "../types/projectTopic";

import overviewIcon from "../assets/icons/overview.svg";
import featuresIcon from "../assets/icons/features.svg";
import technologiesIcon from "../assets/icons/technologies.svg";
import architectureIcon from "../assets/icons/architecture.svg";

export type { ProjectTopicId };
export { DEFAULT_PROJECT_TOPIC_ID } from "../types/projectTopic";

export const projectTopicDefinitions = {
  overview: {
    labelPl: "Opis projektu",
    labelEn: "Overview",
    icon: overviewIcon,
  },
  features: {
    labelPl: "Główne funkcje",
    labelEn: "Main features",
    icon: featuresIcon,
  },
  technologies: {
    labelPl: "Technologie",
    labelEn: "Technologies",
    icon: technologiesIcon,
  },
  architecture: {
    labelPl: "Architektura",
    labelEn: "Architecture",
    icon: architectureIcon,
  },
} as const satisfies Record<
  ProjectTopicId,
  { labelPl: string; labelEn: string; icon: string }
>;

export const projectTopicOrder = Object.keys(
  projectTopicDefinitions,
) as ProjectTopicId[];

export const projectTopicIcons: Record<ProjectTopicId, string> =
  Object.fromEntries(
    projectTopicOrder.map((topicId) => [
      topicId,
      projectTopicDefinitions[topicId].icon,
    ]),
  ) as Record<ProjectTopicId, string>;

export const projectTopicLabels = Object.fromEntries(
  projectTopicOrder.map((topicId) => [
    topicId,
    {
      pl: projectTopicDefinitions[topicId].labelPl,
      en: projectTopicDefinitions[topicId].labelEn,
    },
  ]),
) as Record<ProjectTopicId, { pl: string; en: string }>;

export function createEmptyProjectTopic(
  id: ProjectTopicId,
): ProjectTopicContent {
  return {
    id,
    contentPl: "",
    contentEn: "",
    imageAltPl: "",
    imageAltEn: "",
  };
}

export function normalizeProjectTopics(project: Project): Project {
  return {
    ...project,
    topics: projectTopicOrder.map(
      (topicId) =>
        project.topics.find((topic) => topic.id === topicId) ??
        createEmptyProjectTopic(topicId),
    ),
  };
}
