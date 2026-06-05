import { portfolioData } from "../data/portfolio";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import ExperienceSection from "../components/home/ExperienceSection";
import ProjectsSection from "../components/home/ProjectsSection";
import SkillsSection from "../components/home/SkillsSection";
import EducationSection from "../components/home/EducationSection";
import AwardsSection from "../components/home/AwardsSection";
import ContactSection from "../components/home/ContactSection";

const Home = () => (
  <div className="w-full max-w-[1100px] mx-auto px-8 md:px-8">
    <HeroSection personal={portfolioData.personal} />
    <StatsSection quickStats={portfolioData.personal.quickStats} />
    <ExperienceSection experience={portfolioData.experience} />
    <ProjectsSection projects={portfolioData.projects} />
    <SkillsSection skills={portfolioData.skills} />
    <EducationSection education={portfolioData.education} />
    <AwardsSection
      awards={portfolioData.awards}
      certifications={portfolioData.certifications}
    />
    <ContactSection personal={portfolioData.personal} />
  </div>
);

export default Home;
