import { useCallback } from "react";

import type { Project, ProjectTopicId } from "@shared/database/types/project";
import type { Dispatch, SetStateAction } from "react";

import {
  updateProjectField,
  updateProjectTopicField,
} from "./projectEditorMutations";
import type { ProjectTextField, TopicTextField } from "./projectEditorTypes";

type UseProjectTopicsEditorParams = {
  activeProject: Project | undefined;
  activeTopic: Project["topics"][number] | undefined;
  setProjects: Dispatch<SetStateAction<Project[]>>;
};

export function useProjectTopicsEditor({
  activeProject,
  activeTopic,
  setProjects,
}: UseProjectTopicsEditorParams) {
  const updateProject = useCallback(
    (field: ProjectTextField, value: string) => {
      if (!activeProject) {
        return;
      }

      setProjects((currentProjects) =>
        updateProjectField(currentProjects, activeProject.id, field, value),
      );
    },
    [activeProject, setProjects],
  );

  const updateProjectTopic = useCallback(
    (topicId: ProjectTopicId, field: TopicTextField, value: string) => {
      if (!activeProject) {
        return;
      }

      setProjects((currentProjects) =>
        updateProjectTopicField(
          currentProjects,
          activeProject.id,
          topicId,
          field,
          value,
        ),
      );
    },
    [activeProject, setProjects],
  );

  const updateTopic = useCallback(
    (field: TopicTextField, value: string) => {
      if (!activeProject || !activeTopic) {
        return;
      }

      updateProjectTopic(activeTopic.id, field, value);
    },
    [activeProject, activeTopic, updateProjectTopic],
  );

  return {
    updateProject,
    updateProjectTopic,
    updateTopic,
  };
}
