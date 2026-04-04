import { motion } from "framer-motion";
import { certifications, education } from "@/data/portfolio";
import { Award, GraduationCap } from "lucide-react";

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-12">Certifications & Education</h2>
        </motion.div>

        {/* Education */}
        <div className="mb-12">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Education
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <p className="font-medium text-foreground">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.school} · {edu.year}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" /> Professional Certifications
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{cert.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{cert.issuer} · {cert.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
