import SectionHeading from "../components/sections/SectionHeading";
import SkillGroup from "../components/skills/SkillGroup";
import SkillItem from "../components/skills/SkillItem";
import type { SkillGroupData } from "../types/skill";

type SkillsSectionProps = {
  skillGroups: SkillGroupData[];
  label: string;
  title: string;
};

function SkillsSection({ skillGroups, label, title }: SkillsSectionProps) {
  return (
    <section id="skills" className="scroll-mt-24 py-8 sm:py-10">
      <SectionHeading
        label={label}
        title={title}
      />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        {skillGroups.map((group) => (
          <SkillGroup key={group.id} title={group.title}>
            {group.skills.map((skill) => (
              <SkillItem
                key={skill.id}
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