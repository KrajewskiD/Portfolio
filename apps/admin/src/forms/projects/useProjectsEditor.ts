import { useMemo } from "react";

import { createProjectTranslateFields } from "@admin/forms/projectTranslatableFields";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import type { Project } from "@shared/database/types/project";
import type { Language } from "@shared/database/types/language";
import type { Dispatch, SetStateAction } from "react";

import { useProjectCrud } from "./useProjectCrud";
import { useProjectSelection } from "./useProjectSelection";
import { useProjectTechnologiesEditor } from "./useProjectTechnologiesEditor";
import { useProjectTopicsEditor } from "./useProjectTopicsEditor";

type UseProjectsEditorParams = {
  language: Language;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  syncSavedValue: (value: Project[]) => void;
  clearKeysForProject: (projectId: string) => void;
  isBusy: boolean;
};

export function useProjectsEditor({
  language,
  projects,
  setProjects,
  syncSavedValue,
  clearKeysForProject,
  isBusy,
}: UseProjectsEditorParams) {
  const selection = useProjectSelection({ projects, language });

  const topicsEditor = useProjectTopicsEditor({
    activeProject: selection.activeProject,
    activeTopic: selection.activeTopic,
    setProjects,
  });

  const { updateProject, updateProjectTopic, updateTopic } = topicsEditor;

  const technologiesEditor = useProjectTechnologiesEditor({
    activeProject: selection.activeProject,
    setProjects,
  });

  const crud = useProjectCrud({
    projects,
    setProjects,
    syncSavedValue,
    clearKeysForProject,
    activeProject: selection.activeProject,
    setActiveProjectId: selection.setActiveProjectId,
    setActiveTopicId: selection.setActiveTopicId,
  });

  const bulkTranslateFields = useMemo(
    () =>
      selection.activeProject
        ? createProjectTranslateFields(selection.activeProject, language, {
            onApplyTitle: (field, text) => updateProject(field, text),
            onApplyTopic: (topicId, field, text) =>
              updateProjectTopic(topicId, field, text),
          })
        : [],
    [language, selection.activeProject, updateProject, updateProjectTopic],
  );

  const bulkTranslate = useTranslateFields({
    language,
    disabled: isBusy || !selection.activeProject,
    fields: bulkTranslateFields,
  });

  return {
    ...selection,
    updateProject,
    updateProjectTopic,
    updateTopic,
    ...technologiesEditor,
    ...crud,
    bulkTranslate,
  };
}
