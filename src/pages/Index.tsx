import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ChartsSection from "@/components/portfolio/ChartsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import AwardsSection from "@/components/portfolio/AwardsSection";
import RecruiterSection from "@/components/portfolio/RecruiterSection";
import FeedbackSection from "@/components/portfolio/FeedbackSection";
import ContactSection from "@/components/portfolio/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ChartsSection />
      <CertificationsSection />
      <AwardsSection />
      <RecruiterSection />
      <FeedbackSection />
      <ContactSection />
    </div>
  );
};

export default Index;
