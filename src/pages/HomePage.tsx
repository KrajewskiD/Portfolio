import AboutSection from "../features/AboutSection";
import ProjectsSection from "../features/ProjectsSection";
import SkillsSection from "../features/SkillsSection";
import { translations } from "../locales";
import type { Language } from "../types/language";
import { useProfile } from "../hooks/useProfile";
import { useProjects } from "../hooks/useProjects";
import { useSkillGroups } from "../hooks/useSkillGroups";

type HomePageProps = {
  language: Language;
};

function HomePage({ language }: HomePageProps) {
  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
  } = useProfile();

  const {
    data: projects,
    isPending: areProjectsPending,
    isError: areProjectsError,
  } = useProjects();
  const {
    data: skillGroups,
    isPending: areSkillGroupsPending,
    isError: areSkillGroupsError,
  } = useSkillGroups();

  const translation = translations[language];

  return (
    <>
      <AboutSection
        profile={profile}
        isLoading={isProfilePending}
        isError={isProfileError}
        errorMessage={translation.about.loadError}
        label={translation.about.label}
        noImage={translation.about.noImage}
        language={language}
      />

      <ProjectsSection
        projects={projects}
        isLoading={areProjectsPending}
        isError={areProjectsError}
        errorMessage={translation.projects.loadError}
        emptyMessage={translation.projects.emptyMessage}
        label={translation.projects.label}
        title={translation.projects.title}
        topicLabels={translation.projects.topics}
        noImage={translation.projects.noImage}
        language={language}
      />

      <SkillsSection
        skillGroups={skillGroups}
        isLoading={areSkillGroupsPending}
        isError={areSkillGroupsError}
        errorMessage={translation.skills.loadError}
        emptyMessage={translation.skills.emptyMessage}
        label={translation.skills.label}
        title={translation.skills.title}
        language={language}
        levelLabel={translation.skills.levelLabel}
      />
    </>
  );
}

export default HomePage;
