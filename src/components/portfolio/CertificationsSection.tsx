import { motion } from "framer-motion";
import { certifications } from "@/data/portfolio";
import { Award } from "lucide-react";

const CAT_COLORS: Record<string, string> = {
  "RPA & Automation": "text-cyan-400",
  "Process Excellence": "text-amber-400",
  "AI & Innovation": "text-purple-400",
  "Project Management": "text-pink-400",
  "IT Service Management": "text-emerald-400",
  "ERP & SAP": "text-blue-400",
};

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">Certifications</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Professional Development
            <span className="text-sm font-normal text-muted-foreground ml-3">({certifications.length} certifications)</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Award className={`w-4 h-4 flex-shrink-0 mt-0.5 ${CAT_COLORS[cert.category] || "text-primary"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground leading-snug">{cert.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.issuer} • {cert.date}</p>
                  <span className={`text-[10px] ${CAT_COLORS[cert.category] || "text-primary"}`}>{cert.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
