import SectionHeading from "../components/sections/SectionHeading";
import SectionStatePanel from "../components/sections/SectionStatePanel";
import SkillGroup from "../components/skills/SkillGroup";
import SkillItem from "../components/skills/SkillItem";
import SkillsSkeleton from "../components/skills/SkillsSkeleton";
import type { Translations } from "@portfolio/locales/translations";
import type { Language } from "@shared/database/types/language";
import type { SkillGroupData } from "@shared/database/types/skill";
import { getLocalizedField } from "@shared/utils/localizedField";

type SkillsSectionProps = {
  skillGroups?: SkillGroupData[];
  isLoading: boolean;
  isError: boolean;
  text: Translations["skills"];
  language: Language;
};

function SkillsSection({
  skillGroups,
  isLoading,
  isError,
  text,
  language,
}: SkillsSectionProps) {
  return (
    <section id="skills" className="site-section--default">
      <SectionHeading label={text.label} title={text.title} />

      <SectionStatePanel
        isLoading={isLoading}
        isError={isError}
        isEmpty={!skillGroups?.length}
        errorMessage={text.loadError}
        emptyMessage={text.emptyMessage}
        loading={<SkillsSkeleton />}
      >
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          {skillGroups?.map((group) => (
            <SkillGroup
              key={group.id}
              title={getLocalizedField(group, language, "titlePl", "titleEn")}
            >
              {group.skills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  name={skill.name}
                  level={skill.level}
                  showLevel={skill.showLevel}
                  levelLabel={text.levelLabel}
                />
              ))}
            </SkillGroup>
          ))}
        </div>
      </SectionStatePanel>
    </section>
  );
}

export default SkillsSection;
