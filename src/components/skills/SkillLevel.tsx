type SkillLevelProps = {
  level: number;
  maxLevel?: number;
};

function SkillLevel({ level, maxLevel = 5 }: SkillLevelProps) {
  const safeLevel = Math.min(Math.max(level, 0), maxLevel);

  return (
    <span
      className="flex gap-1.5"
      aria-label={`Poziom ${safeLevel} na ${maxLevel}`}
    >
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