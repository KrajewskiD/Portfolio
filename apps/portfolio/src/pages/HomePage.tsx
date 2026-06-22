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
        text={translation.about}
        socialLinksLabel={socialLinksLabel}
        language={language}
      />

      <ProjectsSection
        projects={projects}
        isLoading={areProjectsPending}
        isError={areProjectsError}
        text={translation.projects}
        language={language}
      />

      <SkillsSection
        skillGroups={skillGroups}
        isLoading={areSkillGroupsPending}
        isError={areSkillGroupsError}
        text={translation.skills}
        language={language}
      />
    </>
  );
}

export default HomePage;
