import SectionHeading from "../components/sections/SectionHeading";
import SkillGroup from "../components/skills/SkillGroup";
import SkillItem from "../components/skills/SkillItem";
import SkillsSkeleton from "../components/skills/SkillsSkeleton";
import type { Language } from "../types/language";
import type { SkillGroupData } from "../types/skill";

type SkillsSectionProps = {
  skillGroups?: SkillGroupData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  emptyMessage: string;
  label: string;
  title: string;
  language: Language;
  levelLabel: string;
};

function SkillsSection({
  skillGroups,
  isLoading,
  isError,
  errorMessage,
  emptyMessage,
  label,
  title,
  levelLabel,
  language,
}: SkillsSectionProps) {
  return (
    <section id="skills" className="scroll-mt-24 py-8 sm:py-10">
      <SectionHeading label={label} title={title} />

      {isLoading ? (
        <SkillsSkeleton />
      ) : isError ? (
        <div
          role="alert"
          className="mt-6 flex min-h-64 items-center justify-center rounded-3xl border text-center"
        >
          <p className="text-lg">{errorMessage}</p>
        </div>
      ) : !skillGroups?.length ? (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-3xl border text-center">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          {skillGroups.map((group) => (
            <SkillGroup
              key={group.id}
              title={language === "pl" ? group.titlePl : group.titleEn}
            >
              {group.skills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  name={skill.name}
                  description={
                    language === "pl"
                      ? skill.descriptionPl
                      : skill.descriptionEn
                  }
                  level={skill.level}
                  levelLabel={levelLabel}
                />
              ))}
            </SkillGroup>
          ))}
        </div>
      )}
    </section>
  );
}

export default SkillsSection;
