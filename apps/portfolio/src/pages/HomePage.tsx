import AboutSection from "../features/AboutSection";
import ProjectsSection from "../features/ProjectsSection";
import SkillsSection from "../features/SkillsSection";
import { translations } from "../locales";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import { useProjects } from "../hooks/useProjects";
import { useSkillGroups } from "../hooks/useSkillGroups";
import type { Profile } from "@shared/database/types/profile";

type HomePageProps = {
  language: Language;
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  isProfileLoading: boolean;
  isProfileError: boolean;
  socialLinksLabel: string;
};

function HomePage({
  language,
  profile,
  footerLinks,
  isProfileLoading,
  isProfileError,
  socialLinksLabel,
}: HomePageProps) {
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
        footerLinks={footerLinks}
        isLoading={isProfileLoading}
        isError={isProfileError}
        errorMessage={translation.about.loadError}
        label={translation.about.label}
        noImage={translation.about.noImage}
        socialLinksLabel={socialLinksLabel}
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
