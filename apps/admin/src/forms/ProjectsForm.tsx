import { useMemo, useState } from "react";

import ProjectTopicContentPanel from "@admin/components/projects/ProjectTopicContentPanel";
import ProjectTopicImagePanel from "@admin/components/projects/ProjectTopicImagePanel";
import ProjectTopicTabs from "@admin/components/projects/ProjectTopicTabs";
import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminButton from "@admin/components/ui/AdminButton";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import AdminSelect from "@admin/components/ui/AdminSelect";
import AdminTranslateButton from "@admin/components/ui/AdminTranslateButton";
import { projectDrafts } from "@admin/data/adminDrafts";
import type { AdminFormProps } from "@admin/types/adminForms";
import { projectTopicOrder } from "@shared/constants/projectTopics";
import type { Project, ProjectTopicContent, ProjectTopicId } from "@shared/types/project";

type ProjectTextField = "code" | "titlePl" | "titleEn";

function ProjectsForm({ language }: AdminFormProps) {
  const [projects, setProjects] = useState<Project[]>(projectDrafts);
  const [activeProjectId, setActiveProjectId] = useState(projectDrafts[0]?.id ?? "");
  const [activeTopicId, setActiveTopicId] = useState<ProjectTopicId>("overview");

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? projects[0],
    [activeProjectId, projects],
  );

  const activeTopic =
    activeProject.topics.find((topic) => topic.id === activeTopicId) ??
    activeProject.topics[0];

  const titleField = language === "pl" ? "titlePl" : "titleEn";

  function updateProject(field: ProjectTextField, value: string) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              [field]: value,
            }
          : project,
      ),
    );
  }

  function updateTechnologies(value: string) {
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

  function updateTopic(
    field: keyof ProjectTopicContent,
    value: string,
  ) {
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
    const nextId = `project-${String(nextIndex).padStart(2, "0")}`;

    const nextProject: Project = {
      id: nextId,
      code: `PROJECT_${String(nextIndex).padStart(2, "0")}`,
      titlePl: "Nowy projekt PL",
      titleEn: "New project EN",
      technologies: [],
      topics: projectTopicOrder.map((topicId) => ({
        id: topicId,
        contentPl: "",
        contentEn: "",
        imageUrl: "",
        imageAltPl: "",
        imageAltEn: "",
      })),
    };

    setProjects((currentProjects) => [...currentProjects, nextProject]);
    setActiveProjectId(nextProject.id);
    setActiveTopicId("overview");
  }

  return (
    <section className="space-y-8">
      <AdminFormHeader
        title="Projekty"
        description="Edytuj projekt, jego technologie oraz treści przypisane do konkretnych zakładek."
        actions={
          <>
            <AdminAddButton label="Dodaj projekt" onClick={addProject} />
            <AdminButton type="button" variant="secondary" disabled>
              Zapisz
            </AdminButton>
          </>
        }
      />

      <AdminField id="project-select" label="Projekt">
        <AdminSelect
          id="project-select"
          value={activeProject.id}
          onChange={(event) => {
            setActiveProjectId(event.target.value);
            setActiveTopicId("overview");
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project[titleField]}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminPanel>
        <p className="font-mono text-sm font-bold text-white/35">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AdminField id="project-code" label="Kod projektu">
            <AdminInput
              id="project-code"
              value={activeProject.code ?? ""}
              onChange={(event) => updateProject("code", event.target.value)}
            />
          </AdminField>

          <AdminField
            id="project-title"
            label="Nazwa projektu"
            action={<AdminTranslateButton language={language} />}
          >
            <AdminInput
              id="project-title"
              value={activeProject[titleField]}
              onChange={(event) => updateProject(titleField, event.target.value)}
            />
          </AdminField>
        </div>

        <AdminField
          id="project-technologies"
          label="Technologie"
          hint="Wpisz technologie po przecinku, np. React, TypeScript, Supabase."
        >
          <AdminInput
            id="project-technologies"
            value={activeProject.technologies.join(", ")}
            onChange={(event) => updateTechnologies(event.target.value)}
          />
        </AdminField>

        <ProjectTopicTabs
          activeTopicId={activeTopic.id}
          language={language}
          onChange={setActiveTopicId}
        />

        <div className="border-t border-white/10 pt-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <ProjectTopicImagePanel
              topic={activeTopic}
              language={language}
              onChange={updateTopic}
            />

            <ProjectTopicContentPanel
              topic={activeTopic}
              language={language}
              onChange={updateTopic}
            />
          </div>
        </div>
      </AdminPanel>
    </section>
  );
}

export default ProjectsForm;