import { Helmet } from "react-helmet-async";
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
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  useVisitorTracking();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Prakhar Parashar — SAP & Automation Leader</title>
        <meta name="description" content="Prakhar Parashar — Senior SAP & Intelligent Automation Leader. 13+ yrs in SAP S/4HANA, Blue Prism RPA, AI-supported automation and GBS O2C transformation." />
        <link rel="canonical" href="https://prakharparashar.lovable.app/" />
        <meta property="og:url" content="https://prakharparashar.lovable.app/" />
        <meta property="og:title" content="Prakhar Parashar — SAP & Automation Leader" />
        <meta property="og:description" content="Senior SAP & Intelligent Automation Leader — SAP S/4HANA, Blue Prism RPA, AI-supported automation, GBS O2C." />
      </Helmet>
      <Navbar theme={theme} setTheme={setTheme} />
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
