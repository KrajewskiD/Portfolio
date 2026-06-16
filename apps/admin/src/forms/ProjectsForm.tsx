import { useState } from "react";

import AdminButton from "../components/ui/AdminButton";
import AdminField from "../components/ui/AdminField";
import AdminPanel from "../components/ui/AdminPanel";
import AdminSelect from "../components/ui/AdminSelect";
import type { AdminFormProps } from "../types/adminForms";

type AdminProjectDraft = {
  id: string;
  code: string;
  titlePl: string;
  titleEn: string;
};

const projectDrafts: AdminProjectDraft[] = [
  {
    id: "project-01",
    code: "PROJECT_01",
    titlePl: "Nazwa projektu PL",
    titleEn: "Project name EN",
  },
  {
    id: "project-02",
    code: "PROJECT_02",
    titlePl: "Panel administratora PL",
    titleEn: "Admin panel EN",
  },
];

function ProjectsForm({ language }: AdminFormProps) {
  const [activeProjectId, setActiveProjectId] = useState(
    projectDrafts[0]?.id ?? "",
  );

  const activeProject = projectDrafts.find(
    (project) => project.id === activeProjectId,
  );

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Projekty</h2>
          <p className="mt-2 text-white/60">
            Wybierz projekt z listy albo dodaj nowy.
          </p>
        </div>

        <AdminButton type="button" className="px-5 py-2 text-xl font-black">
          +
        </AdminButton>
      </header>

      <AdminField id="project-select" label="Projekt">
        <AdminSelect
          id="project-select"
          value={activeProjectId}
          onChange={(event) => setActiveProjectId(event.target.value)}
        >
          {projectDrafts.map((project) => (
            <option key={project.id} value={project.id}>
              {language === "pl" ? project.titlePl : project.titleEn}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminPanel>
        <p className="font-mono text-sm text-white/40">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        {activeProject && (
          <div className="mt-4">
            <p className="font-mono text-sm text-white/40">
              {activeProject.code}
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {language === "pl"
                ? activeProject.titlePl
                : activeProject.titleEn}
            </h3>
          </div>
        )}
      </AdminPanel>
    </section>
  );
}

export default ProjectsForm;
