import { useEffect, useId, useRef } from "react";

import {
  projectTopicIcons,
  projectTopicLabels,
  projectTopicOrder,
} from "@shared/constants/projectTopics";
import RichTextContent from "@shared/components/RichTextContent";
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
  const panelRef = useRef<HTMLDivElement>(null);

  const orderedTopics = projectTopicOrder
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is ProjectTopicContent => topic !== undefined);

  const activeTopic =
    orderedTopics.find((topic) => topic.id === activeId) ?? orderedTopics[0];

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activeId]);

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

      <div ref={panelRef} className="site-topic-panel">
        <p className="site-label text-sm">
          {projectTopicLabels[activeTopic.id][language]}
        </p>

        <RichTextContent
          className="site-body--panel"
          content={getLocalizedField(
            activeTopic,
            language,
            "contentPl",
            "contentEn",
          )}
        />
      </div>
    </div>
  );
}

export default ProjectTopicsGroup;
