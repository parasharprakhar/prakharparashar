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
        <title>O2C Transformation &amp; Automation Portfolio | SAP S/4HANA</title>
        <meta name="description" content="Prakhar Parashar — O2C Transformation, SAP S/4HANA, RPA and AI-led automation across GCC and GBS operations." />
        <link rel="canonical" href="https://prakharparashar.lovable.app/" />
        <meta property="og:url" content="https://prakharparashar.lovable.app/" />
        <meta property="og:title" content="O2C Transformation & Automation Portfolio | SAP S/4HANA" />
        <meta property="og:description" content="Prakhar Parashar — O2C Transformation, SAP S/4HANA, RPA and AI-led automation." />
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
