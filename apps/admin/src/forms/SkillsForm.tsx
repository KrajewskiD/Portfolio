import AdminButton from "../components/ui/AdminButton";
import AdminField from "../components/ui/AdminField";
import AdminInput from "../components/ui/AdminInput";
import AdminPanel from "../components/ui/AdminPanel";
import AdminSelect from "../components/ui/AdminSelect";
import AdminTextarea from "../components/ui/AdminTextarea";
import type { AdminFormProps } from "../types/adminForms";

type SkillDraft = {
  id: string;
  groupPl: string;
  groupEn: string;
  name: string;
  level: number;
  descriptionPl: string;
  descriptionEn: string;
};

const skillDrafts: SkillDraft[] = [
  {
    id: "react",
    groupPl: "Frontend",
    groupEn: "Frontend",
    name: "React",
    level: 4,
    descriptionPl: "Lorem ipsum dolor sit amet. PL",
    descriptionEn: "Lorem ipsum dolor sit amet. EN",
  },
  {
    id: "typescript",
    groupPl: "Frontend",
    groupEn: "Frontend",
    name: "TypeScript",
    level: 4,
    descriptionPl: "Lorem ipsum dolor sit amet. PL",
    descriptionEn: "Lorem ipsum dolor sit amet. EN",
  },
];

function SkillsForm({ language }: AdminFormProps) {
  const activeSkill = skillDrafts[0];

  const groupValue =
    language === "pl" ? activeSkill.groupPl : activeSkill.groupEn;

  const descriptionValue =
    language === "pl" ? activeSkill.descriptionPl : activeSkill.descriptionEn;

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Umiejętności</h2>
          <p className="mt-2 text-white/60">
            Edycja technologii, grup i poziomu umiejętności.
          </p>
        </div>

        <AdminButton type="button" className="px-5 py-2 text-xl font-black">
          +
        </AdminButton>
      </header>

      <AdminPanel className="grid gap-5">
        <p className="font-mono text-sm text-white/40">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <AdminField id="skill-select" label="Umiejętność">
          <AdminSelect id="skill-select" defaultValue={activeSkill.id}>
            {skillDrafts.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </AdminSelect>
        </AdminField>

        <AdminField id="skill-group" label="Grupa">
          <AdminInput id="skill-group" defaultValue={groupValue} />
        </AdminField>

        <AdminField id="skill-name" label="Technologia">
          <AdminInput id="skill-name" defaultValue={activeSkill.name} />
        </AdminField>

        <AdminField id="skill-level" label="Poziom">
          <AdminInput
            id="skill-level"
            type="number"
            min={1}
            max={5}
            defaultValue={activeSkill.level}
          />
        </AdminField>

        <AdminField id="skill-description" label="Opis">
          <AdminTextarea
            id="skill-description"
            rows={4}
            defaultValue={descriptionValue}
          />
        </AdminField>
      </AdminPanel>
    </section>
  );
}

export default SkillsForm;
