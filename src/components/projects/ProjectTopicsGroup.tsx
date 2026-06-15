import { useId, useState } from "react";

import type { Language } from "../../types/language";
import type { ProjectTopicContent, ProjectTopicId } from "../../types/project";
import ProjectTopic from "./ProjectTopic";

type ProjectTopicsGroupProps = {
  topics: ProjectTopicContent[];
  topicLabels: Record<ProjectTopicId, string>;
  language: Language;
};

function ProjectTopicsGroup({ topics, topicLabels, language }: ProjectTopicsGroupProps) {
  const groupId = useId();
  const [activeId, setActiveId] = useState(topics[0]?.id ?? "");

  const activeTopic =
    topics.find((topic) => topic.id === activeId) ?? topics[0];

  if (!activeTopic) {
    return null;
  }

  const panelId = `${groupId}-panel`;

  return (
    <>
      <div role="tablist" className="mt-6 flex w-full overflow-x-auto border-b">
        {topics.map((topic) => (
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
        <p className="font-mono text-sm">
          {topicLabels[activeTopic.id]}
        </p>

        <p className="mt-2 leading-7">
          {language === "pl" ? activeTopic.contentPl : activeTopic.contentEn}
        </p>
      </div>
    </>
  );
}

export default ProjectTopicsGroup;
