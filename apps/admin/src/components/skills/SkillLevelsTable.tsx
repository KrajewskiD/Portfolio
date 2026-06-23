import AdminEmptyMessage from "@admin/components/ui/AdminEmptyMessage";
import AdminInput from "@admin/components/ui/AdminInput";
import type { Skill } from "@shared/database/types/skill";

type SkillLevelsTableProps = {
  skills: Skill[];
  disabled?: boolean;
  onLevelChange: (skillId: string, level: number) => void;
  onShowLevelChange: (skillId: string, showLevel: boolean) => void;
};

function SkillLevelsTable({
  skills,
  disabled = false,
  onLevelChange,
  onShowLevelChange,
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 border-b border-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white/45 uppercase">
        <span>Umiejętność</span>
        <span className="text-center">Użyj poziomu</span>
        <span className="w-16 text-center">Poziom</span>
      </div>

      {skills.map((skill) => (
        <div
          key={skill.id}
          className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-t border-white/10 px-4 py-3 first:border-t-0"
        >
          <span className="min-w-0 truncate font-bold text-white">
            {skill.name}
          </span>

          <label className="inline-flex items-center justify-center">
            <span className="sr-only">Pokazuj poziom: {skill.name}</span>
            <input
              type="checkbox"
              checked={skill.showLevel}
              disabled={disabled}
              aria-label={`Pokazuj poziom: ${skill.name}`}
              className="h-4 w-4 cursor-pointer accent-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
              onChange={(event) =>
                onShowLevelChange(skill.id, event.target.checked)
              }
            />
          </label>

          <AdminInput
            id={`skill-level-${skill.id}`}
            type="number"
            min={1}
            max={5}
            aria-label={`Poziom: ${skill.name}`}
            className="admin-control-compact admin-control-compact--level w-16 text-center"
            value={skill.level}
            disabled={disabled || !skill.showLevel}
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
