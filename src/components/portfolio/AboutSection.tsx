import { motion } from "framer-motion";
import { profile, education } from "@/data/portfolio";
import { GraduationCap } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-3">About</h2>
          <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed mb-8">
            {profile.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <GraduationCap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.school} • {edu.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
