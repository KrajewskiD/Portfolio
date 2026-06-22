import { useCallback, useState } from "react";

import { deleteAdminProject } from "@admin/database/projects/ProjectRepository";
import {
  projectTopicOrder,
  createEmptyProjectTopic,
} from "@shared/constants/projectTopics";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Project, ProjectTopicId } from "@shared/database/types/project";
import type { Dispatch, SetStateAction } from "react";

type UseProjectCrudParams = {
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  syncSavedValue: (value: Project[]) => void;
  clearKeysForProject: (projectId: string) => void;
  activeProject: Project | undefined;
  setActiveProjectId: (projectId: string) => void;
  setActiveTopicId: (topicId: ProjectTopicId) => void;
};

export function useProjectCrud({
  projects,
  setProjects,
  syncSavedValue,
  clearKeysForProject,
  activeProject,
  setActiveProjectId,
  setActiveTopicId,
}: UseProjectCrudParams) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const addProject = useCallback(() => {
    const nextIndex = projects.length + 1;

    const nextProject: Project = {
      id: crypto.randomUUID(),
      code: `PROJECT_${String(nextIndex).padStart(2, "0")}`,
      titlePl: "Nowy projekt PL",
      titleEn: "New project EN",
      technologies: [],
      topics: projectTopicOrder.map((topicId) =>
        createEmptyProjectTopic(topicId),
      ),
    };

    setProjects((currentProjects) => [...currentProjects, nextProject]);
    setActiveProjectId(nextProject.id);
    setActiveTopicId(DEFAULT_PROJECT_TOPIC_ID);
  }, [projects.length, setActiveProjectId, setActiveTopicId, setProjects]);

  const deleteProject = useCallback(async () => {
    if (!activeProject) {
      return;
    }

    setDeleteError(undefined);
    setIsDeleting(true);

    try {
      await deleteAdminProject(activeProject.id);

      const remainingProjects = projects.filter(
        (project) => project.id !== activeProject.id,
      );

      syncSavedValue(remainingProjects);
      clearKeysForProject(activeProject.id);
      setActiveProjectId(remainingProjects[0]?.id ?? "");
      setActiveTopicId(DEFAULT_PROJECT_TOPIC_ID);
    } catch {
      setDeleteError("Nie udało się usunąć projektu. Spróbuj ponownie.");
    } finally {
      setIsDeleting(false);
    }
  }, [
    activeProject,
    clearKeysForProject,
    projects,
    setActiveProjectId,
    setActiveTopicId,
    syncSavedValue,
  ]);

  return {
    isDeleting,
    deleteError,
    addProject,
    deleteProject,
  };
}
