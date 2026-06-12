import { useState } from "react";

import type { ProjectTopicData } from "../../types/project";
import ProjectTopic from "./ProjectTopic";

type ProjectTopicsGroupProps = {
  topics: ProjectTopicData[];
};

function ProjectTopicsGroup({ topics }: ProjectTopicsGroupProps) {
  const [activeId, setActiveId] = useState(
    topics[0]?.id ?? "",
  );

  const activeTopic =
    topics.find((topic) => topic.id === activeId) ??
    topics[0];

  if (!activeTopic) {
    return null;
  }

  return (
    <>
      <ul className="mt-6 space-y-1">
        {topics.map((topic) => (
          <ProjectTopic
            key={topic.id}
            label={topic.label}
            active={topic.id === activeTopic.id}
            onSelect={() => setActiveId(topic.id)}
          />
        ))}
      </ul>

      <div className="mt-5 rounded-xl border-l-2 p-4">
        <p className="font-mono text-sm">
          {activeTopic.label}
        </p>

        <p className="mt-2 leading-7">
          {activeTopic.content}
        </p>
      </div>
    </>
  );
}

export default ProjectTopicsGroup;