import type { ProjectTopicId } from "../types/project";
import overviewIcon from "../assets/icons/overview.svg";
import featuresIcon from "../assets/icons/features.svg";
import technologiesIcon from "../assets/icons/technologies.svg";
import architectureIcon from "../assets/icons/architecture.svg";

export const projectTopicOrder: ProjectTopicId[] = [
  "overview",
  "features",
  "technologies",
  "architecture",
];

export const projectTopicIcons: Record<ProjectTopicId, string> = {
  overview: overviewIcon,
  features: featuresIcon,
  technologies: technologiesIcon,
  architecture: architectureIcon,
};