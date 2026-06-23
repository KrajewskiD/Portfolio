import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import { mainPageDraft } from "@admin/data/adminDrafts";
import ProjectBasicFields from "@admin/components/projects/ProjectBasicFields";
import ProjectContentColumn from "@admin/components/projects/ProjectContentColumn";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslateFields } from "@admin/hooks/useTranslateFields";
import {
  getAdminMainPage,
  saveAdminMainPage,
} from "@admin/services/mainPageContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import { useMemo, useState } from "react";
import type { MainPage } from "@shared/database/types/mainPage";
import { createProjectTranslateFields } from "./projectTranslatableFields";
import {
  createEmptyProjectTechnology,
  type Project,
  type ProjectTechnology,
} from "@shared/database/types/project";
import { DEFAULT_PROJECT_TOPIC_ID } from "@shared/database/types/projectTopic";
import type { ProjectTextField, TopicTextField } from "./projects/projectEditorTypes";
import { applyAboutSiteProject, getAboutSiteProject } from "@shared/utils/aboutSiteProject";

function AboutSiteForm({ language }: AdminFormProps) {
  const { isOverlayOpen } = useTranslationOverlay();
  const [activeTopicId, setActiveTopicId] = useState(DEFAULT_PROJECT_TOPIC_ID);
  const form = useAdminForm<MainPage>({
    initialValue: mainPageDraft,
    loadValue: getAdminMainPage,
    saveValue: saveAdminMainPage,
  });

  const formDisabled = form.isLoading || form.isSaving || isOverlayOpen;
  const aboutSiteProject = useMemo(
    () => getAboutSiteProject(form.value),
    [form.value],
  );

  const activeTopic =
    aboutSiteProject.topics.find((topic) => topic.id === activeTopicId) ??
    aboutSiteProject.topics[0];

  function updateProjectValue(mutator: (project: Project) => Project) {
    form.setValue((current) =>
      applyAboutSiteProject(current, mutator(getAboutSiteProject(current))),
    );
  }

  function updateProject(field: ProjectTextField, value: string) {
    updateProjectValue((project) => ({
      ...project,
      [field]: value,
    }));
  }

  function updateTopic(field: TopicTextField, value: string) {
    if (!activeTopic) {
      return;
    }

    updateProjectValue((project) => ({
      ...project,
      topics: project.topics.map((topic) =>
        topic.id === activeTopic.id ? { ...topic, [field]: value } : topic,
      ),
    }));
  }

  function addTechnology() {
    updateProjectValue((project) => ({
      ...project,
      technologies: [...project.technologies, createEmptyProjectTechnology()],
    }));
  }

  function updateTechnology(
    index: number,
    field: keyof Pick<ProjectTechnology, "name" | "iconSlug">,
    value: string,
  ) {
    updateProjectValue((project) => ({
      ...project,
      technologies: project.technologies.map((technology, currentIndex) =>
        currentIndex === index ? { ...technology, [field]: value } : technology,
      ),
    }));
  }

  function removeTechnology(index: number) {
    updateProjectValue((project) => ({
      ...project,
      technologies: project.technologies.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  const bulkTranslate = useTranslateFields({
    language,
    disabled: formDisabled,
    fields: createProjectTranslateFields(
      aboutSiteProject,
      language,
      {
        onApplyTitle: (field, text) => updateProject(field, text),
        onApplyMiniatureAlt: () => {},
        onApplyTopic: (topicId, field, text) => {
          updateProjectValue((project) => ({
            ...project,
            topics: project.topics.map((topic) =>
              topic.id === topicId ? { ...topic, [field]: text } : topic,
            ),
          }));
        },
      },
    ),
  });

  return (
    <AdminFormShell
      title="O stronie"
      description="Edytuj kartę otwieraną z przycisku „O stronie” w prawym górnym rogu portfolio."
      loadError={form.loadError}
      saveError={form.saveError}
      saveSuccess={form.saveSuccess}
      extraErrors={bulkTranslate.error ? [bulkTranslate.error] : []}
      actions={
        <AdminFormActions>
          <AdminFormSaveActions
            language={language}
            saveDisabled={formDisabled || !form.isDirty}
            isSaving={form.isSaving}
            onSave={form.save}
            translateDisabled={formDisabled}
            isBulkTranslating={bulkTranslate.isTranslating}
            translateTitle="Przetłumacz treść sekcji „O stronie” przez Gemini AI"
            onTranslateAll={bulkTranslate.onTranslateAll}
          />
        </AdminFormActions>
      }
    >
      <div className="admin-stack">
        <AdminEditLanguageBanner language={language} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-start">
          <div className="admin-stack min-w-0">
            <ProjectBasicFields
              project={aboutSiteProject}
              disabled={formDisabled}
              onUpdate={updateProject}
            />
          </div>

          <ProjectContentColumn
            project={aboutSiteProject}
            topic={
              activeTopic ?? {
                id: DEFAULT_PROJECT_TOPIC_ID,
                contentPl: "",
                contentEn: "",
                imageAltPl: "",
                imageAltEn: "",
              }
            }
            language={language}
            disabled={formDisabled}
            onUpdateProject={updateProject}
            onUpdateTopic={updateTopic}
            onTopicChange={setActiveTopicId}
            onAddTechnology={addTechnology}
            onUpdateTechnology={updateTechnology}
            onRemoveTechnology={removeTechnology}
          />
        </div>
      </div>
    </AdminFormShell>
  );
}

export default AboutSiteForm;
