import { profileMock, projectMock, skillGroupsMock, } from "../data/portfolio.mock";
import AboutSection from "../features/AboutSection";
import ProjectsSection from "../features/ProjectsSection";
import SkillsSection from "../features/SkillsSection";

function HomePage() {
  return (
    <>
      <AboutSection profile={profileMock} />
      <ProjectsSection projects={projectMock} />
      <SkillsSection skillGroups={skillGroupsMock} />
    </>
  );
}

export default HomePage;