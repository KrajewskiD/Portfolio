import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminInput from "@admin/components/ui/AdminInput";
import type { Skill } from "@shared/database/types/skill";

type SkillLevelsTableProps = {
  skills: Skill[];
  disabled?: boolean;
  onLevelChange: (skillId: string, level: number) => void;
};

function SkillLevelsTable({
  skills,
  disabled = false,
  onLevelChange,
}: SkillLevelsTableProps) {
  if (skills.length === 0) {
    return (
      <AdminEmptyMessage inline>
        Brak umiejętności w tej grupie. Dodaj je w Ustawieniach.
      </AdminEmptyMessage>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white/45 uppercase">
        <span>Umiejętność</span>
        <span className="w-16 text-center">Poziom</span>
      </div>

      {skills.map((skill) => (
        <div
          key={skill.id}
          className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-white/10 px-4 py-3 first:border-t-0"
        >
          <span className="min-w-0 truncate font-bold text-white">
            {skill.name}
          </span>

          <AdminInput
            id={`skill-level-${skill.id}`}
            type="number"
            min={1}
            max={5}
            aria-label={`Poziom: ${skill.name}`}
            className="admin-control-compact admin-control-compact--level w-16 text-center"
            value={skill.level}
            disabled={disabled}
            onChange={(event) =>
              onLevelChange(skill.id, Number(event.target.value))
            }
          />
        </div>
      ))}
    </div>
  );
}

export default SkillLevelsTable;
