import { useCallback, useMemo, useState } from "react";

import ProjectTopicContentPanel, {
  type ProjectTopicContentField,
} from "@admin/components/projects/ProjectTopicContentPanel";
import ProjectTopicImagePanel, {
  type ProjectTopicImageField,
} from "@admin/components/projects/ProjectTopicImagePanel";
import ProjectTopicTabs from "@admin/components/projects/ProjectTopicTabs";
import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminCustomSelect from "@admin/components/ui/AdminCustomSelect";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormFeedback from "@admin/components/ui/AdminFormFeedback";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import { projectDrafts } from "@admin/data/adminDrafts";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { usePendingKeyedImages } from "@admin/hooks/usePendingKeyedImages";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
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
import { normalizeProjectIds } from "@shared/database";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { Project, ProjectTopicId } from "@shared/database/types/project";
import {
  getLocalizedField,
  getLocalizedKey,
  getOppositeLocalizedKey,
} from "@shared/utils/localizedField";

type ProjectTextField = "code" | "titlePl" | "titleEn";
type TopicTextField = ProjectTopicContentField | ProjectTopicImageField;

function topicImageKey(projectId: string, topicId: ProjectTopicId) {
  return `${projectId}:${topicId}`;
}

function ProjectsForm({ language }: AdminFormProps) {
  const {
    pendingFiles: pendingTopicImages,
    setPendingFiles: setPendingTopicImages,
    markedForRemovals: pendingTopicImageRemovals,
    setMarkedForRemovals: setPendingTopicImageRemovals,
    hasPendingEdits: hasPendingImageEdits,
    discardPending: discardPendingImages,
    clearKeysForPrefix,
  } = usePendingKeyedImages();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const prepareBeforeSave = useCallback(
    async (currentProjects: Project[]) => {
      const normalizedProjects = normalizeProjectIds(currentProjects);
      const hasPendingUploads = Object.keys(pendingTopicImages).length > 0;
      const hasPendingRemovals = Object.values(pendingTopicImageRemovals).some(
        Boolean,
      );

      if (!hasPendingUploads && !hasPendingRemovals) {
        return normalizedProjects;
      }

      const updatedProjects = await Promise.all(
        normalizedProjects.map(async (project) => ({
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
    [
      pendingTopicImageRemovals,
      pendingTopicImages,
      setPendingTopicImageRemovals,
      setPendingTopicImages,
    ],
  );

  const {
    value: projects,
    setValue: setProjects,
    syncSavedValue,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminForm<Project[]>({
    initialValue: projectDrafts,
    loadValue: getAdminProjects,
    saveValue: saveAdminProjects,
    prepareBeforeSave,
    extraDirty: hasPendingImageEdits,
    onDiscard: discardPendingImages,
  });

  const { isOverlayOpen } = useTranslationOverlay();

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

  const isBusy = isLoading || isSaving || isDeleting || isOverlayOpen;

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

    updateProjectTopic(activeTopic.id, field, value);
  }

  function updateProjectTopic(
    topicId: ProjectTopicId,
    field: TopicTextField,
    value: string,
  ) {
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
  }

  const bulkTranslateFields = activeProject
    ? [
        {
          id: "project-title",
          sourceText: getLocalizedField(
            activeProject,
            language,
            "titlePl",
            "titleEn",
          ),
          onApply: (text: string) =>
            updateProject(
              getOppositeLocalizedKey(language, "titlePl", "titleEn"),
              text,
            ),
        },
        ...activeProject.topics.flatMap((topic) => [
          {
            id: `topic-${topic.id}-content`,
            sourceText: getLocalizedField(
              topic,
              language,
              "contentPl",
              "contentEn",
            ),
            onApply: (text: string) =>
              updateProjectTopic(
                topic.id,
                getOppositeLocalizedKey(language, "contentPl", "contentEn"),
                text,
              ),
          },
          {
            id: `topic-${topic.id}-image-alt`,
            sourceText: getLocalizedField(
              topic,
              language,
              "imageAltPl",
              "imageAltEn",
            ),
            onApply: (text: string) =>
              updateProjectTopic(
                topic.id,
                getOppositeLocalizedKey(language, "imageAltPl", "imageAltEn"),
                text,
              ),
          },
        ]),
      ]
    : [];

  const bulkTranslate = useTranslateFields({
    language,
    disabled: isBusy || !activeProject,
    fields: bulkTranslateFields,
  });

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

      syncSavedValue(remainingProjects);
      clearKeysForPrefix(activeProject.id);
      setActiveProjectId(remainingProjects[0]?.id ?? "");
      setActiveTopicId(DEFAULT_PROJECT_TOPIC_ID);
    } catch {
      setDeleteError("Nie udało się usunąć projektu. Spróbuj ponownie.");
    } finally {
      setIsDeleting(false);
    }
  }

  const activeTopicImageKey = activeProject
    ? topicImageKey(
        activeProject.id,
        activeTopic?.id ?? DEFAULT_PROJECT_TOPIC_ID,
      )
    : "";

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
                label: getLocalizedField(
                  project,
                  language,
                  "titlePl",
                  "titleEn",
                ),
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
            <AdminFormSaveActions
              language={language}
              saveDisabled={isBusy || projects.length === 0}
              isSaving={isSaving}
              onSave={save}
              translateDisabled={isBusy || !activeProject}
              isBulkTranslating={bulkTranslate.isTranslating}
              translateTitle="Przetłumacz wszystkie pola projektu przez Gemini AI"
              onTranslateAll={bulkTranslate.onTranslateAll}
            />
          </AdminFormActions>
        }
      />

      <AdminFormFeedback
        loadError={loadError}
        saveError={saveError}
        saveSuccess={saveSuccess}
        extraErrors={[
          ...(bulkTranslate.error ? [bulkTranslate.error] : []),
          ...(deleteError ? [deleteError] : []),
        ]}
      />

      <AdminPanel>
        {!activeProject || !activeTopic ? (
          <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 text-center text-white/50">
            <p>Brak projektów. Dodaj pierwszy projekt, aby rozpocząć edycję.</p>
          </div>
        ) : (
          <>
            <AdminEditLanguageBanner language={language} />

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
                  selectedFile={pendingTopicImages[activeTopicImageKey] ?? null}
                  imageMarkedForRemoval={
                    pendingTopicImageRemovals[activeTopicImageKey] ?? false
                  }
                  onFileSelect={(file) => {
                    setPendingTopicImages((current) => {
                      if (!file) {
                        const next = { ...current };
                        delete next[activeTopicImageKey];
                        return next;
                      }

                      return { ...current, [activeTopicImageKey]: file };
                    });

                    if (file) {
                      setPendingTopicImageRemovals((current) => {
                        if (!current[activeTopicImageKey]) {
                          return current;
                        }

                        const next = { ...current };
                        delete next[activeTopicImageKey];
                        return next;
                      });
                    }
                  }}
                  onImageMarkedForRemovalChange={(marked) => {
                    setPendingTopicImageRemovals((current) => {
                      if (marked) {
                        return { ...current, [activeTopicImageKey]: true };
                      }

                      if (!current[activeTopicImageKey]) {
                        return current;
                      }

                      const next = { ...current };
                      delete next[activeTopicImageKey];
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
                    disabled={isBusy}
                    sourceText={getLocalizedField(
                      activeProject,
                      language,
                      "titlePl",
                      "titleEn",
                    )}
                    onApply={(text) =>
                      updateProject(
                        getOppositeLocalizedKey(language, "titlePl", "titleEn"),
                        text,
                      )
                    }
                  >
                    <AdminInput
                      id="project-title"
                      maxLength={PROJECT_TITLE_MAX_LENGTH}
                      value={getLocalizedField(
                        activeProject,
                        language,
                        "titlePl",
                        "titleEn",
                      )}
                      onChange={(event) =>
                        updateProject(
                          getLocalizedKey(language, "titlePl", "titleEn"),
                          event.target.value,
                        )
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
                  disabled={isBusy}
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
