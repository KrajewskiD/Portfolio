import { useId } from "react";

import {
  projectTopicIcons,
  projectTopicLabels,
  projectTopicOrder,
} from "@shared/constants/projectTopics";
import type { Language } from "@shared/database/types/language";
import type {
  ProjectTopicContent,
  ProjectTopicId,
  ProjectTopics,
} from "@shared/database/types/project";
import { getLocalizedField } from "@shared/utils/localizedField";
import ProjectTopic from "./ProjectTopic";

type ProjectTopicsGroupProps = {
  topics: ProjectTopics;
  activeId: ProjectTopicId;
  onTopicChange: (id: ProjectTopicId) => void;
  language: Language;
  sectionLabel: string;
};

function ProjectTopicsGroup({
  topics,
  activeId,
  onTopicChange,
  language,
  sectionLabel,
}: ProjectTopicsGroupProps) {
  const groupId = useId();

  const orderedTopics = projectTopicOrder
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is ProjectTopicContent => topic !== undefined);

  const activeTopic =
    orderedTopics.find((topic) => topic.id === activeId) ?? orderedTopics[0];

  if (!activeTopic) {
    return null;
  }

  return (
    <div className="site-topic-group">
      <div
        role="group"
        aria-label={sectionLabel}
        className="site-topic-list"
      >
        {orderedTopics.map((topic) => (
          <ProjectTopic
            key={topic.id}
            id={`${groupId}-${topic.id}-tab`}
            label={projectTopicLabels[topic.id][language]}
            iconSrc={projectTopicIcons[topic.id]}
            active={topic.id === activeTopic.id}
            onSelect={() => onTopicChange(topic.id)}
          />
        ))}
      </div>

      <div className="site-topic-panel">
        <p className="site-label text-sm">
          {projectTopicLabels[activeTopic.id][language]}
        </p>

        <p className="site-body--panel">
          {getLocalizedField(
            activeTopic,
            language,
            "contentPl",
            "contentEn",
          )}
        </p>
      </div>
    </div>
  );
}

export default ProjectTopicsGroup;
