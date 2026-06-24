import SkillLevel from "./SkillLevel";

type SkillItemProps = {
  name: string;
  level: number;
  showLevel?: boolean;
  levelLabel: string;
};

function SkillItem({
  name,
  level,
  showLevel = true,
  levelLabel,
}: SkillItemProps) {
  return (
    <div className="site-skill-row">
      <div className="site-skill-item">
        <span className="site-skill-name">{name}</span>
        {showLevel ? (
          <SkillLevel level={level} levelLabel={levelLabel} />
        ) : null}
      </div>
    </div>
  );
}

export default SkillItem;
