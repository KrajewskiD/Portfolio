import { useState } from "react";

import SkillLevel from "./SkillLevel";

type SkillItemProps = {
  name: string;
  description: string;
  level: number;
};

function SkillItem({
  name,
  description,
  level,
}: SkillItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-3 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="font-semibold">{name}</span>
        <SkillLevel level={level} />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-sm leading-6">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SkillItem;