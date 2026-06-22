import SectionHeading from "../components/sections/SectionHeading";
import SkillGroup from "../components/skills/SkillGroup";
import SkillItem from "../components/skills/SkillItem";
import SkillsSkeleton from "../components/skills/SkillsSkeleton";
import type { Language } from "@shared/database/types/language";
import type { SkillGroupData } from "@shared/database/types/skill";
import { getLocalizedField } from "@shared/utils/localizedField";

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
    <section id="skills" className="site-section--default">
      <SectionHeading label={label} title={title} />

      {isLoading ? (
        <SkillsSkeleton />
      ) : isError ? (
        <div role="alert" className="site-panel--empty">
          <p className="site-text-error">{errorMessage}</p>
        </div>
      ) : !skillGroups?.length ? (
        <div className="site-panel--empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          {skillGroups.map((group) => (
            <SkillGroup
              key={group.id}
              title={getLocalizedField(group, language, "titlePl", "titleEn")}
            >
              {group.skills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  name={skill.name}
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
