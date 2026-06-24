import AboutSection from "../features/AboutSection";
import ProjectsSection from "../features/ProjectsSection";
import SkillsSection from "../features/SkillsSection";
import { translations } from "../locales";
import type { FooterLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Profile } from "@shared/database/types/profile";
import type { Project } from "@shared/database/types/project";
import type { SkillGroupData } from "@shared/database/types/skill";

type HomePageProps = {
  language: Language;
  profile?: Profile;
  footerLinks?: FooterLinkData[];
  projects?: Project[];
  skillGroups?: SkillGroupData[];
  isProfileLoading: boolean;
  isProfileError: boolean;
  areProjectsPending: boolean;
  areProjectsError: boolean;
  areSkillGroupsPending: boolean;
  areSkillGroupsError: boolean;
  socialLinksLabel: string;
};

function HomePage({
  language,
  profile,
  footerLinks,
  projects,
  skillGroups,
  isProfileLoading,
  isProfileError,
  areProjectsPending,
  areProjectsError,
  areSkillGroupsPending,
  areSkillGroupsError,
  socialLinksLabel,
}: HomePageProps) {
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
