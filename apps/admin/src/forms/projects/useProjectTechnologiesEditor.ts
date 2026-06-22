import { useCallback } from "react";

import { createEmptyProjectTechnology } from "@shared/database/types/project";
import type { Project } from "@shared/database/types/project";
import type { Dispatch, SetStateAction } from "react";

import {
  appendProjectTechnology,
  removeProjectTechnology,
  updateProjectTechnology,
} from "./projectEditorMutations";

type UseProjectTechnologiesEditorParams = {
  activeProject: Project | undefined;
  setProjects: Dispatch<SetStateAction<Project[]>>;
};

export function useProjectTechnologiesEditor({
  activeProject,
  setProjects,
}: UseProjectTechnologiesEditorParams) {
  const addTechnology = useCallback(() => {
    if (!activeProject) {
      return;
    }

    setProjects((currentProjects) =>
      appendProjectTechnology(
        currentProjects,
        activeProject.id,
        createEmptyProjectTechnology(),
      ),
    );
  }, [activeProject, setProjects]);

  const updateTechnology = useCallback(
    (index: number, field: "name" | "iconSlug", value: string) => {
      if (!activeProject) {
        return;
      }

      setProjects((currentProjects) =>
        updateProjectTechnology(
          currentProjects,
          activeProject.id,
          index,
          field,
          value,
        ),
      );
    },
    [activeProject, setProjects],
  );

  const removeTechnology = useCallback(
    (index: number) => {
      if (!activeProject) {
        return;
      }

      setProjects((currentProjects) =>
        removeProjectTechnology(currentProjects, activeProject.id, index),
      );
    },
    [activeProject, setProjects],
  );

  return {
    addTechnology,
    updateTechnology,
    removeTechnology,
  };
}
