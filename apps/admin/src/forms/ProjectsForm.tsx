import { useCallback, useMemo, useState } from "react";

import ProjectTopicContentPanel, {
  type ProjectTopicContentField,
} from "@admin/components/projects/ProjectTopicContentPanel";
import ProjectTopicImagePanel, {
  type ProjectTopicImageField,
} from "@admin/components/projects/ProjectTopicImagePanel";
import ProjectVideoPanel from "@admin/components/projects/ProjectVideoPanel";
import ProjectTopicTabs from "@admin/components/projects/ProjectTopicTabs";
import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminEntitySelect from "@admin/components/ui/AdminEntitySelect";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminTranslatableField from "@admin/components/ui/AdminTranslatableField";
import {
  deleteAdminProject,
  getAdminProjects,
  saveAdminProjects,
} from "@admin/database/projects/ProjectRepository";
import { projectDrafts } from "@admin/data/adminDrafts";
import { createProjectTranslateFields } from "@admin/forms/projectTranslatableFields";
import { useActiveTopicImageHandlers } from "@admin/hooks/useActiveTopicImageHandlers";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { usePendingKeyedImages } from "@admin/hooks/usePendingKeyedImages";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import { useTranslationOverlay } from "@admin/context/TranslationOverlayContext";
import {
  deleteProjectTopicImage,
  deleteProjectVideo,
  getProjectImagePublicUrl,
  getProjectVideoPublicUrl,
  uploadProjectTopicImage,
  uploadProjectVideo,
} from "@admin/lib/imageStorage";
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

function projectVideoKey(projectId: string) {
  return `${projectId}:video`;
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
  const {
    pendingFiles: pendingProjectVideos,
    setPendingFiles: setPendingProjectVideos,
    markedForRemovals: pendingProjectVideoRemovals,
    setMarkedForRemovals: setPendingProjectVideoRemovals,
    hasPendingEdits: hasPendingVideoEdits,
    discardPending: discardPendingVideos,
  } = usePendingKeyedImages();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();
  const [technologyInputs, setTechnologyInputs] = useState<
    Record<string, string>
  >({});

  const prepareBeforeSave = useCallback(
    async (currentProjects: Project[]) => {
      const normalizedProjects = normalizeProjectIds(currentProjects);
      const hasPendingImageUploads = Object.keys(pendingTopicImages).length > 0;
      const hasPendingImageRemovals = Object.values(
        pendingTopicImageRemovals,
      ).some(Boolean);
      const hasPendingVideoUploads = Object.keys(pendingProjectVideos).length > 0;
      const hasPendingVideoRemovals = Object.values(
        pendingProjectVideoRemovals,
      ).some(Boolean);

      if (
        !hasPendingImageUploads &&
        !hasPendingImageRemovals &&
        !hasPendingVideoUploads &&
        !hasPendingVideoRemovals
      ) {
        return normalizedProjects;
      }

      const updatedProjects = await Promise.all(
        normalizedProjects.map(async (project) => {
          const videoKey = projectVideoKey(project.id);
          const pendingVideoFile = pendingProjectVideos[videoKey];
          const pendingVideoRemoval = pendingProjectVideoRemovals[videoKey];
          let nextVideoPath = project.videoPath;
          let nextVideoUrl = project.videoUrl;

          if (pendingVideoFile) {
            nextVideoPath = await uploadProjectVideo(project.id, pendingVideoFile);
            nextVideoUrl = getProjectVideoPublicUrl(nextVideoPath);
          } else if (pendingVideoRemoval && project.videoPath) {
            await deleteProjectVideo(project.videoPath);
            nextVideoPath = undefined;
            nextVideoUrl = undefined;
          }

          return {
            ...project,
            videoPath: nextVideoPath,
            videoUrl: nextVideoUrl,
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
          };
        }),
      );

      setPendingTopicImages({});
      setPendingTopicImageRemovals({});
      setPendingProjectVideos({});
      setPendingProjectVideoRemovals({});
      return updatedProjects;
    },
    [
      pendingProjectVideoRemovals,
      pendingProjectVideos,
      pendingTopicImageRemovals,
      pendingTopicImages,
      setPendingProjectVideoRemovals,
      setPendingProjectVideos,
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
    extraDirty: hasPendingImageEdits || hasPendingVideoEdits,
    onDiscard: () => {
      discardPendingImages();
      discardPendingVideos();
      setTechnologyInputs({});
    },
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

    setTechnologyInputs((currentInputs) => ({
      ...currentInputs,
      [activeProject.id]: value,
    }));

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

  const bulkTranslateFields = useMemo(
    () =>
      activeProject
        ? createProjectTranslateFields(activeProject, language, {
            onApplyTitle: (field, text) => updateProject(field, text),
            onApplyTopic: (topicId, field, text) =>
              updateProjectTopic(topicId, field, text),
          })
        : [],
    [activeProject, language],
  );

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

  const activeProjectVideoKey = activeProject
    ? projectVideoKey(activeProject.id)
    : "";

  const { onFileSelect, onImageMarkedForRemovalChange } =
    useActiveTopicImageHandlers(
      activeTopicImageKey,
      setPendingTopicImages,
      setPendingTopicImageRemovals,
    );

  const {
    onFileSelect: onVideoFileSelect,
    onImageMarkedForRemovalChange: onVideoMarkedForRemovalChange,
  } = useActiveTopicImageHandlers(
    activeProjectVideoKey,
    setPendingProjectVideos,
    setPendingProjectVideoRemovals,
  );

  return (
    <AdminFormShell
      title="Projekty"
      description="Edytuj projekt, jego technologie oraz treści przypisane do konkretnych zakładek."
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      extraErrors={[
        ...(bulkTranslate.error ? [bulkTranslate.error] : []),
        ...(deleteError ? [deleteError] : []),
      ]}
      actions={
        <AdminFormActions>
          <AdminEntitySelect
            id="project-select"
            ariaLabel="Projekt"
            className="w-80 max-w-full"
            value={activeProject?.id ?? ""}
            disabled={isLoading || projects.length === 0}
            items={projects}
            getItemId={(project) => project.id}
            getItemLabel={(project) =>
              getLocalizedField(project, language, "titlePl", "titleEn")
            }
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
    >
      {!activeProject || !activeTopic ? (
        <AdminEmptyMessage>
          Brak projektów. Dodaj pierwszy projekt, aby rozpocząć edycję.
        </AdminEmptyMessage>
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
                onFileSelect={onFileSelect}
                onImageMarkedForRemovalChange={onImageMarkedForRemovalChange}
                onChange={updateTopic}
              />

              <ProjectVideoPanel
                videoUrl={activeProject.videoUrl}
                selectedFile={pendingProjectVideos[activeProjectVideoKey] ?? null}
                videoMarkedForRemoval={
                  pendingProjectVideoRemovals[activeProjectVideoKey] ?? false
                }
                disabled={isBusy}
                onFileSelect={onVideoFileSelect}
                onVideoMarkedForRemovalChange={onVideoMarkedForRemovalChange}
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
                    value={
                      technologyInputs[activeProject.id] ??
                      activeProject.technologies.join(", ")
                    }
                    onChange={(event) => updateTechnologies(event.target.value)}
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
    </AdminFormShell>
  );
}

export default ProjectsForm;
