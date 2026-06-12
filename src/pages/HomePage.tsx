import {
  profileMock,
  projectsMock,
  skillGroupsMock,
} from "../data/portfolio.mock";
import AboutSection from "../features/AboutSection";
import ProjectsSection from "../features/ProjectsSection";
import SkillsSection from "../features/SkillsSection";
import { translations } from "../locales";
import type { Language } from "../types/language";

type HomePageProps = {
  language: Language;
};

function HomePage({ language }: HomePageProps) {
  const translation = translations[language];

  return (
    <>
      <AboutSection
        profile={profileMock}
        label={translation.about.label}
        noImage={translation.about.noImage}
        language={language}
      />

      <ProjectsSection
        projects={projectsMock}
        label={translation.projects.label}
        title={translation.projects.title}
        noImage={translation.projects.noImage}
        language={language}
      />

      <SkillsSection
        skillGroups={skillGroupsMock}
        label={translation.skills.label}
        title={translation.skills.title}
        language={language}
        levelLabel={translation.skills.levelLabel}
      />
    </>
  );
}

export default HomePage;
