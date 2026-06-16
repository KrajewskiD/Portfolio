import { useMemo } from "react";

import {
  DEFAULT_PROJECT_TOPIC_ID,
  type ProjectTopicId,
} from "@shared/types/projectTopic";
import type { ProjectTopics } from "@shared/types/project";

type UseProjectTopicOptions = {
  topics: ProjectTopics;
  selectedTopicId?: ProjectTopicId;
};

export function useProjectTopic({
  topics,
  selectedTopicId = DEFAULT_PROJECT_TOPIC_ID,
}: UseProjectTopicOptions) {
  const orderedTopics = topics;

  const activeTopic = useMemo(() => {
    return (
      orderedTopics.find((topic) => topic.id === selectedTopicId) ??
      orderedTopics.find((topic) => topic.id === DEFAULT_PROJECT_TOPIC_ID) ??
      orderedTopics[0]
    );
  }, [orderedTopics, selectedTopicId]);

  return {
    activeTopic,
    activeTopicId: activeTopic?.id ?? DEFAULT_PROJECT_TOPIC_ID,
  };
}
