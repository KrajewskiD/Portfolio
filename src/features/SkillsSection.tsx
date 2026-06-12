import SectionHeading from "../components/sections/SectionHeading";
import SkillGroup from "../components/skills/SkillGroup";
import SkillItem from "../components/skills/SkillItem";
import type { SkillGroupData } from "../types/skill";

type SkillsSectionProps = {
  skillGroups: SkillGroupData[];
};
function SkillsSection({ skillGroups, }: SkillsSectionProps) {
  return (
    <section id="skills" className="scroll-mt-24 py-8 sm:py-10">
      <SectionHeading
        label="umiejętności"
        title="Umiejętności"
      />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        {skillGroups.map((group) => (
          <SkillGroup key={group.title} title={group.title}>
            {group.skills.map((skill) => (
              <SkillItem
                key={skill.name}
                name={skill.name}
                description={skill.description}
                level={skill.level}
              />
            ))}
          </SkillGroup>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;