import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-12">Experience</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-16">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-8 top-1 w-2 h-2 -translate-x-[3px] rounded-full bg-primary shadow-[0_0_10px_hsl(175_80%_50%/0.5)]" />

                <div className="text-xs font-mono text-primary mb-2">{exp.period}</div>
                <h3 className="text-xl font-semibold text-foreground mb-1">{exp.role}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {exp.company} · {exp.location}
                </p>

                {exp.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="text-sm text-muted-foreground/80 flex gap-2">
                        <span className="text-primary mt-1 shrink-0">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
