import SkillLevel from "./SkillLevel";

type SkillItemProps = {
  name: string;
  level: number;
  levelLabel: string;
};

function SkillItem({ name, level, levelLabel }: SkillItemProps) {
  return (
    <div className="site-skill-row">
      <div className="site-skill-item">
        <span className="site-skill-name">{name}</span>
        <SkillLevel level={level} levelLabel={levelLabel} />
      </div>
    </div>
  );
}

export default SkillItem;
