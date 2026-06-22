type SkillLevelProps = {
  level: number;
  maxLevel?: number;
  levelLabel: string;
};

function SkillLevel({ level, maxLevel = 5, levelLabel }: SkillLevelProps) {
  const safeLevel = Math.min(Math.max(level, 0), maxLevel);
  const ariaLabel = levelLabel
    .replace("{level}", String(safeLevel))
    .replace("{maxLevel}", String(maxLevel));
  return (
    <span className="flex gap-1.5" role="img" aria-label={ariaLabel}>
      {Array.from({ length: maxLevel }, (_, index) => {
        const dot = index + 1;

        return (
          <span
            key={dot}
            className={`h-2.5 w-2.5 rounded-full border ${
              dot <= safeLevel ? "bg-current" : "opacity-30"
            }`}
          />
        );
      })}
    </span>
  );
}

export default SkillLevel;
