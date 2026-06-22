import { useCallback, useMemo, useState } from "react";

import { projectDrafts } from "@admin/data/adminDrafts";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Project, ProjectTopicId } from "@shared/database/types/project";
import type { Language } from "@shared/database/types/language";
import { getLocalizedField } from "@shared/utils/localizedField";

import {
  projectMiniatureKey,
  projectVideoKey,
  topicImageKey,
} from "./projectMediaKeys";

type UseProjectSelectionParams = {
  projects: Project[];
  language: Language;
};

export function useProjectSelection({
  projects,
  language,
}: UseProjectSelectionParams) {
  const [activeProjectId, setActiveProjectId] = useState(
    projectDrafts[0]?.id ?? "",
  );
  const [activeTopicId, setActiveTopicId] = useState<ProjectTopicId>(
    DEFAULT_PROJECT_TOPIC_ID,
  );

  const activeProject = useMemo(
    () =>
      projects.find((project) => project.id === activeProjectId) ?? projects[0],
    [activeProjectId, projects],
  );

  const activeTopic = activeProject
    ? (activeProject.topics.find((topic) => topic.id === activeTopicId) ??
      activeProject.topics[0])
    : undefined;

  const selectProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTopicId(DEFAULT_PROJECT_TOPIC_ID);
  }, []);

  const activeTopicImageKey = activeProject
    ? topicImageKey(
        activeProject.id,
        activeTopic?.id ?? DEFAULT_PROJECT_TOPIC_ID,
      )
    : "";

  const activeProjectVideoKey = activeProject
    ? projectVideoKey(activeProject.id)
    : "";

  const activeProjectMiniatureKey = activeProject
    ? projectMiniatureKey(activeProject.id)
    : "";

  const activeProjectTitle = activeProject
    ? getLocalizedField(activeProject, language, "titlePl", "titleEn")
    : "";

  return {
    activeProject,
    activeProjectId: activeProject?.id ?? "",
    activeTopic,
    activeTopicId,
    setActiveProjectId,
    setActiveTopicId,
    selectProject,
    activeTopicImageKey,
    activeProjectVideoKey,
    activeProjectMiniatureKey,
    activeProjectTitle,
  };
}
