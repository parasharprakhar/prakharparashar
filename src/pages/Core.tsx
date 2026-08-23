import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BootSequence from "@/components/core/BootSequence";
import CoreHero from "@/components/core/CoreHero";
import CorePipeline from "@/components/core/CorePipeline";
import CoreSkillDie from "@/components/core/CoreSkillDie";
import CoreModules from "@/components/core/CoreModules";
import CoreBadges from "@/components/core/CoreBadges";
import CoreTerminal from "@/components/core/CoreTerminal";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const BOOT_KEY = "core-booted";

const Core = () => {
  useVisitorTracking();
  const [booting, setBooting] = useState(() => {
    try {
      return sessionStorage.getItem(BOOT_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const finishBoot = () => {
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* storage unavailable — boot once per load */
    }
    setBooting(false);
  };

  return (
    <div className="core-mode min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <Helmet>
        <title>PRAKHAR // CORE — Automation Command Center</title>
        <meta
          name="description"
          content="CORE mode — a command-center view of Prakhar Parashar's SAP S/4HANA, Blue Prism RPA and GenAI automation portfolio: telemetry, career pipeline, skill die map and deployed modules."
        />
        <link rel="canonical" href="https://prakharparashar.lovable.app/core" />
        <meta property="og:url" content="https://prakharparashar.lovable.app/core" />
        <meta property="og:title" content="PRAKHAR // CORE — Automation Command Center" />
        <meta property="og:description" content="Cinematic command-center portfolio: SAP S/4HANA, Blue Prism RPA and AI-enabled automation." />
      </Helmet>

      <div className="pointer-events-none fixed inset-0 core-circuit opacity-70" aria-hidden="true" />

      <AnimatePresence>{booting && <BootSequence key="boot" onDone={finishBoot} />}</AnimatePresence>

      <Link
        to="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-md border border-border bg-card/70 backdrop-blur px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="w-3 h-3" /> Exit Core
      </Link>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: booting ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <CoreHero />
        <CorePipeline />
        <CoreSkillDie />
        <CoreModules />
        <CoreBadges />
        <CoreTerminal />
      </motion.main>
    </div>
  );
};

export default Core;
