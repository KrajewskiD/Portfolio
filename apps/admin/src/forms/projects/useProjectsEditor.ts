import { useCallback, useMemo, useState } from "react";

import { deleteAdminProject } from "@admin/database/projects/ProjectRepository";
import { projectDrafts } from "@admin/data/adminDrafts";
import { createProjectTranslateFields } from "@admin/forms/projectTranslatableFields";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import type { ProjectTopicContentField } from "@admin/components/projects/ProjectTopicContentPanel";
import type { ProjectTopicImageField } from "@admin/components/projects/ProjectTopicImagePanel";
import {
  projectTopicOrder,
  createEmptyProjectTopic,
} from "@shared/constants/projectTopics";
import { PROJECT_TITLE_MAX_LENGTH } from "@shared/constants/project";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Project, ProjectTopicId } from "@shared/database/types/project";
import { createEmptyProjectTechnology } from "@shared/database/types/project";
import type { Language } from "@shared/database/types/language";
import {
  getLocalizedField,
} from "@shared/utils/localizedField";
import type { Dispatch, SetStateAction } from "react";

import {
  projectMiniatureKey,
  projectVideoKey,
  topicImageKey,
} from "./projectMediaKeys";

export type ProjectTextField = "code" | "projectUrl" | "titlePl" | "titleEn";
export type TopicTextField = ProjectTopicContentField | ProjectTopicImageField;

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
  const [activeProjectId, setActiveProjectId] = useState(
    projectDrafts[0]?.id ?? "",
  );
  const [activeTopicId, setActiveTopicId] = useState<ProjectTopicId>(
    DEFAULT_PROJECT_TOPIC_ID,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const activeProject = useMemo(
    () =>
      projects.find((project) => project.id === activeProjectId) ?? projects[0],
    [activeProjectId, projects],
  );

  const activeTopic = activeProject
    ? (activeProject.topics.find((topic) => topic.id === activeTopicId) ??
      activeProject.topics[0])
    : undefined;

  const updateProject = useCallback(
    (field: ProjectTextField, value: string) => {
      if (!activeProject) {
        return;
      }

      const nextValue =
        field === "titlePl" || field === "titleEn"
          ? value.slice(0, PROJECT_TITLE_MAX_LENGTH)
          : value;

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                [field]: nextValue,
              }
            : project,
        ),
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
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                topics: project.topics.map((topic) =>
                  topic.id === topicId
                    ? {
                        ...topic,
                        [field]: value,
                      }
                    : topic,
                ),
              }
            : project,
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

  const addTechnology = useCallback(() => {
    if (!activeProject) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              technologies: [
                ...project.technologies,
                createEmptyProjectTechnology(),
              ],
            }
          : project,
      ),
    );
  }, [activeProject, setProjects]);

  const updateTechnology = useCallback(
    (index: number, field: "name" | "iconSlug", value: string) => {
      if (!activeProject) {
        return;
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                technologies: project.technologies.map(
                  (technology, technologyIndex) =>
                    technologyIndex === index
                      ? {
                          ...technology,
                          [field]: value,
                        }
                      : technology,
                ),
              }
            : project,
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
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? {
                ...project,
                technologies: project.technologies.filter(
                  (_, technologyIndex) => technologyIndex !== index,
                ),
              }
            : project,
        ),
      );
    },
    [activeProject, setProjects],
  );

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
  }, [projects.length, setProjects]);

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
  }, [activeProject, clearKeysForProject, projects, syncSavedValue]);

  const bulkTranslateFields = useMemo(
    () =>
      activeProject
        ? createProjectTranslateFields(activeProject, language, {
            onApplyTitle: (field, text) => updateProject(field, text),
            onApplyTopic: (topicId, field, text) =>
              updateProjectTopic(topicId, field, text),
          })
        : [],
    [activeProject, language, updateProject, updateProjectTopic],
  );

  const bulkTranslate = useTranslateFields({
    language,
    disabled: isBusy || !activeProject,
    fields: bulkTranslateFields,
  });

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
    setActiveTopicId,
    activeTopicImageKey,
    activeProjectVideoKey,
    activeProjectMiniatureKey,
    activeProjectTitle,
    isDeleting,
    deleteError,
    bulkTranslate,
    updateProject,
    updateTopic,
    addTechnology,
    updateTechnology,
    removeTechnology,
    addProject,
    deleteProject,
    selectProject,
  };
}
