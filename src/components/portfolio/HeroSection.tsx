import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-4">
            // Digital Transformation
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            <span className="text-foreground">{profile.name.split(" ")[0]}</span>
            <br />
            <span className="text-gradient">{profile.name.split(" ")[1]}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-4">
            {profile.title}
          </p>
          <p className="text-muted-foreground/70 text-sm md:text-base max-w-xl mx-auto mb-12 font-light">
            {profile.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
        >
          {profile.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="inline-block mt-20 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
