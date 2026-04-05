import { motion } from "framer-motion";
import { coreCompetencies } from "@/data/portfolio";

const SKILL_COLORS = [
  "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  "border-purple-500/30 text-purple-300 bg-purple-500/10",
  "border-amber-500/30 text-amber-300 bg-amber-500/10",
  "border-pink-500/30 text-pink-300 bg-pink-500/10",
  "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
  "border-blue-500/30 text-blue-300 bg-blue-500/10",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">Core Skills</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-8">Competencies & Expertise</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2.5"
        >
          {coreCompetencies.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.08 }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-default transition-all ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
