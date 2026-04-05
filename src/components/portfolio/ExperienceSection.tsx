import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";
import { Briefcase } from "lucide-react";

const TIMELINE_COLORS = [
  "border-l-cyan-400",
  "border-l-purple-400",
  "border-l-amber-400",
  "border-l-pink-400",
  "border-l-emerald-400",
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">Experience</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-8">Professional Journey</p>
        </motion.div>

        <div className="space-y-4">
          {experience.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-xl bg-card border border-border border-l-4 ${TIMELINE_COLORS[i % TIMELINE_COLORS.length]}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    {job.role}
                  </h3>
                  <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                </div>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{job.period}</span>
              </div>
              {job.highlights.length > 0 && (
                <ul className="space-y-1 mt-3">
                  {job.highlights.map((h, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1.5 text-[6px]">●</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
