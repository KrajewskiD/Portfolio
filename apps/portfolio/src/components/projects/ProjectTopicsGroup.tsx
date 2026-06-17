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
import ProjectTopic from "./ProjectTopic";

type ProjectTopicsGroupProps = {
  topics: ProjectTopics;
  activeId: ProjectTopicId;
  onTopicChange: (id: ProjectTopicId) => void;
  language: Language;
};

function ProjectTopicsGroup({
  topics,
  activeId,
  onTopicChange,
  language,
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

  const panelId = `${groupId}-panel`;

  return (
    <div className="mt-6 grid grid-cols-[1fr_auto] gap-4 sm:block">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="col-start-2 row-start-1 flex translate-x-3 flex-col border-l sm:translate-x-0 sm:flex-row sm:overflow-x-auto sm:border-b sm:border-l-0"
      >
        {orderedTopics.map((topic) => (
          <ProjectTopic
            key={topic.id}
            id={`${groupId}-${topic.id}-tab`}
            panelId={panelId}
            label={projectTopicLabels[topic.id][language]}
            iconSrc={projectTopicIcons[topic.id]}
            active={topic.id === activeTopic.id}
            onSelect={() => onTopicChange(topic.id)}
          />
        ))}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${groupId}-${activeTopic.id}-tab`}
        className="col-start-1 row-start-1 rounded-xl border-l-2 p-4 sm:mt-5"
      >
        <p className="font-mono text-sm">
          {projectTopicLabels[activeTopic.id][language]}
        </p>

        <p className="mt-2 leading-7">
          {language === "pl" ? activeTopic.contentPl : activeTopic.contentEn}
        </p>
      </div>
    </div>
  );
}

export default ProjectTopicsGroup;
