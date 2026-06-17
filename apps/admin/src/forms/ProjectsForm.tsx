import { useCallback, useMemo, useState } from "react";

import ProjectTopicContentPanel, {
  type ProjectTopicContentField,
} from "@admin/components/projects/ProjectTopicContentPanel";
import ProjectTopicImagePanel, {
  type ProjectTopicImageField,
} from "@admin/components/projects/ProjectTopicImagePanel";
import ProjectTopicTabs from "@admin/components/projects/ProjectTopicTabs";
import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminButton from "@admin/components/ui/AdminButton";
import AdminCustomSelect from "@admin/components/ui/AdminCustomSelect";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { projectDrafts } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import {
  deleteAdminProject,
  deleteProjectTopicImage,
  getAdminProjects,
  getProjectImagePublicUrl,
  saveAdminProjects,
  uploadProjectTopicImage,
} from "@admin/services/projectContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import {
  projectTopicOrder,
  createEmptyProjectTopic,
} from "@shared/constants/projectTopics";
import { PROJECT_TITLE_MAX_LENGTH } from "@shared/constants/project";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Project, ProjectTopicId } from "@shared/database/types/project";

type ProjectTextField = "code" | "titlePl" | "titleEn";
type TopicTextField = ProjectTopicContentField | ProjectTopicImageField;

function topicImageKey(projectId: string, topicId: ProjectTopicId) {
  return `${projectId}:${topicId}`;
}

function ProjectsForm({ language }: AdminFormProps) {
  const [pendingTopicImages, setPendingTopicImages] = useState<
    Record<string, File>
  >({});
  const [pendingTopicImageRemovals, setPendingTopicImageRemovals] = useState<
    Record<string, boolean>
  >({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const prepareBeforeSave = useCallback(
    async (currentProjects: Project[]) => {
      const hasPendingUploads = Object.keys(pendingTopicImages).length > 0;
      const hasPendingRemovals = Object.values(pendingTopicImageRemovals).some(
        Boolean,
      );

      if (!hasPendingUploads && !hasPendingRemovals) {
        return currentProjects;
      }

      const updatedProjects = await Promise.all(
        currentProjects.map(async (project) => ({
          ...project,
          topics: await Promise.all(
            project.topics.map(async (topic) => {
              const key = topicImageKey(project.id, topic.id);
              const file = pendingTopicImages[key];
              const markedForRemoval = pendingTopicImageRemovals[key];

              if (file) {
                const imagePath = await uploadProjectTopicImage(
                  project.id,
                  topic.id,
                  file,
                );

                return {
                  ...topic,
                  imagePath,
                  imageUrl: getProjectImagePublicUrl(imagePath),
                };
              }

              if (markedForRemoval && topic.imagePath) {
                await deleteProjectTopicImage(topic.imagePath);

                return {
                  ...topic,
                  imagePath: undefined,
                  imageUrl: undefined,
                };
              }

              return topic;
            }),
          ),
        })),
      );

      setPendingTopicImages({});
      setPendingTopicImageRemovals({});
      return updatedProjects;
    },
    [pendingTopicImages, pendingTopicImageRemovals],
  );

  const {
    value: projects,
    setValue: setProjects,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminFormSave<Project[]>({
    initialValue: projectDrafts,
    loadValue: getAdminProjects,
    saveValue: saveAdminProjects,
    prepareBeforeSave,
  });

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

  const titleField = language === "pl" ? "titlePl" : "titleEn";
  const isBusy = isLoading || isSaving || isDeleting;

  function updateProject(field: ProjectTextField, value: string) {
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
  }

  function updateTechnologies(value: string) {
    if (!activeProject) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              technologies: value
                .split(",")
                .map((technology) => technology.trim())
                .filter(Boolean),
            }
          : project,
      ),
    );
  }

  function updateTopic(field: TopicTextField, value: string) {
    if (!activeProject || !activeTopic) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              topics: project.topics.map((topic) =>
                topic.id === activeTopic.id
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
  }

  function addProject() {
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
  }

  async function deleteProject() {
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

      setProjects(remainingProjects);
      setPendingTopicImages((current) => {
        const next = { ...current };

        for (const key of Object.keys(next)) {
          if (key.startsWith(`${activeProject.id}:`)) {
            delete next[key];
          }
        }

        return next;
      });
      setPendingTopicImageRemovals((current) => {
        const next = { ...current };

        for (const key of Object.keys(next)) {
          if (key.startsWith(`${activeProject.id}:`)) {
            delete next[key];
          }
        }

        return next;
      });
      setActiveProjectId(remainingProjects[0]?.id ?? "");
      setActiveTopicId(DEFAULT_PROJECT_TOPIC_ID);
    } catch {
      setDeleteError("Nie udało się usunąć projektu. Spróbuj ponownie.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Projekty"
        description="Edytuj projekt, jego technologie oraz treści przypisane do konkretnych zakładek."
        actions={
          <AdminFormActions>
            <AdminCustomSelect
              id="project-select"
              ariaLabel="Projekt"
              className="w-80 max-w-full"
              value={activeProject?.id ?? ""}
              disabled={isLoading || projects.length === 0}
              options={projects.map((project) => ({
                value: project.id,
                label: project[titleField],
              }))}
              onChange={(projectId) => {
                setActiveProjectId(projectId);
                setActiveTopicId(DEFAULT_PROJECT_TOPIC_ID);
              }}
            />
            <AdminDeleteButton
              label="Usuń projekt"
              disabled={isBusy || !activeProject}
              onClick={() => void deleteProject()}
            />
            <AdminAddButton
              label="Dodaj projekt"
              disabled={isBusy}
              onClick={addProject}
            />
            <AdminButton
              type="button"
              variant="secondary"
              disabled={isBusy || projects.length === 0}
              onClick={() => void save()}
            >
              {isSaving ? "Zapisywanie..." : "Zapisz"}
            </AdminButton>
          </AdminFormActions>
        }
      />

      {loadError ? (
        <p role="status" className="text-sm text-amber-300">
          {loadError}
        </p>
      ) : null}

      {saveError ? (
        <p role="alert" className="text-sm text-red-300">
          {saveError}
        </p>
      ) : null}

      {deleteError ? (
        <p role="alert" className="text-sm text-red-300">
          {deleteError}
        </p>
      ) : null}

      {saveSuccess ? (
        <p role="status" className="text-sm text-emerald-300">
          Zmiany zostały zapisane.
        </p>
      ) : null}

      <AdminPanel>
        {!activeProject || !activeTopic ? (
          <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 text-center text-white/50">
            <p>Brak projektów. Dodaj pierwszy projekt, aby rozpocząć edycję.</p>
          </div>
        ) : (
          <>
            <p className="font-mono text-sm font-bold text-white/35">
              Aktywny język edycji: {language.toUpperCase()}
            </p>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
              <div className="admin-stack min-w-0">
                <AdminField id="project-code" label="Kod projektu">
                  <AdminInput
                    id="project-code"
                    value={activeProject.code ?? ""}
                    onChange={(event) =>
                      updateProject("code", event.target.value)
                    }
                  />
                </AdminField>

                <ProjectTopicImagePanel
                  topic={activeTopic}
                  language={language}
                  disabled={isBusy}
                  selectedFile={
                    pendingTopicImages[
                      topicImageKey(activeProject.id, activeTopic.id)
                    ] ?? null
                  }
                  imageMarkedForRemoval={
                    pendingTopicImageRemovals[
                      topicImageKey(activeProject.id, activeTopic.id)
                    ] ?? false
                  }
                  onFileSelect={(file) => {
                    const key = topicImageKey(
                      activeProject.id,
                      activeTopic.id,
                    );

                    setPendingTopicImages((current) => {
                      if (!file) {
                        const next = { ...current };
                        delete next[key];
                        return next;
                      }

                      return { ...current, [key]: file };
                    });

                    if (file) {
                      setPendingTopicImageRemovals((current) => {
                        if (!current[key]) {
                          return current;
                        }

                        const next = { ...current };
                        delete next[key];
                        return next;
                      });
                    }
                  }}
                  onImageMarkedForRemovalChange={(marked) => {
                    const key = topicImageKey(
                      activeProject.id,
                      activeTopic.id,
                    );

                    setPendingTopicImageRemovals((current) => {
                      if (marked) {
                        return { ...current, [key]: true };
                      }

                      if (!current[key]) {
                        return current;
                      }

                      const next = { ...current };
                      delete next[key];
                      return next;
                    });
                  }}
                  onChange={updateTopic}
                />
              </div>

              <div className="flex min-h-full flex-col gap-6">
                <div className="admin-stack">
                  <AdminTranslatableField
                    id="project-title"
                    label="Nazwa projektu"
                    language={language}
                    hint={`Maksymalnie ${PROJECT_TITLE_MAX_LENGTH} znaków.`}
                  >
                    <AdminInput
                      id="project-title"
                      maxLength={PROJECT_TITLE_MAX_LENGTH}
                      value={activeProject[titleField]}
                      onChange={(event) =>
                        updateProject(titleField, event.target.value)
                      }
                    />
                  </AdminTranslatableField>

                  <AdminField
                    id="project-technologies"
                    label="Technologie"
                    hint="Wpisz technologie po przecinku, np. React, TypeScript, Supabase."
                  >
                    <AdminInput
                      id="project-technologies"
                      value={activeProject.technologies.join(", ")}
                      onChange={(event) =>
                        updateTechnologies(event.target.value)
                      }
                    />
                  </AdminField>

                  <AdminField
                    id="project-topic-tabs"
                    label="Zakładka projektu"
                    groupLabel
                  >
                    <ProjectTopicTabs
                      activeTopicId={activeTopic.id}
                      language={language}
                      labelledBy="project-topic-tabs-label"
                      onChange={setActiveTopicId}
                    />
                  </AdminField>
                </div>

                <ProjectTopicContentPanel
                  topic={activeTopic}
                  language={language}
                  fillHeight
                  onChange={updateTopic}
                />
              </div>
            </div>
          </>
        )}
      </AdminPanel>
    </section>
  );
}

export default ProjectsForm;
