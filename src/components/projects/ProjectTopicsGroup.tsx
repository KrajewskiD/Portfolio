import { useId, useState } from "react";

import type { Language } from "../../types/language";
import type { ProjectTopicContent, ProjectTopicId, ProjectTopics,} from "../../types/project";
import ProjectTopic from "./ProjectTopic";
import { projectTopicOrder } from "../../config/projectTopics";

type ProjectTopicsGroupProps = {
  topics: ProjectTopics;
  topicLabels: Record<ProjectTopicId, string>;
  language: Language;
};

function ProjectTopicsGroup({
  topics,
  topicLabels,
  language,
}: ProjectTopicsGroupProps) {
  const groupId = useId();

  // Orders topics
  const orderedTopics = projectTopicOrder
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is ProjectTopicContent => topic !== undefined);

  const [activeId, setActiveId] = useState(orderedTopics[0]?.id ?? ""); // Stores the ID of the active topic tab
  const activeTopic =
    orderedTopics.find((topic) => topic.id === activeId) ?? orderedTopics[0];

  if (!activeTopic) {
    return null;
  }

  const panelId = `${groupId}-panel`;

  return (
    <>
      <div role="tablist" className="mt-6 flex w-full overflow-x-auto border-b">
        {orderedTopics.map((topic) => (
          <ProjectTopic
            key={topic.id}
            id={`${groupId}-${topic.id}-tab`}
            panelId={panelId}
            label={topicLabels[topic.id]}
            active={topic.id === activeTopic.id}
            onSelect={() => setActiveId(topic.id)}
          />
        ))}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${groupId}-${activeTopic.id}-tab`}
        className="mt-5 rounded-xl border-l-2 p-4"
      >
        <p className="font-mono text-sm">{topicLabels[activeTopic.id]}</p>

        <p className="mt-2 leading-7">
          {language === "pl" ? activeTopic.contentPl : activeTopic.contentEn}
        </p>
      </div>
    </>
  );
}

export default ProjectTopicsGroup;
