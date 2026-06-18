import { useState } from "react";

import SkillLevel from "./SkillLevel";

type SkillItemProps = {
  name: string;
  description: string;
  level: number;
  levelLabel: string;
};

function SkillItem({ name, description, level, levelLabel }: SkillItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="site-skill-row">
      <button
        type="button"
        className="site-skill-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="site-skill-name">{name}</span>
        <SkillLevel level={level} levelLabel={levelLabel} />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="site-body--compact pb-4">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default SkillItem;
