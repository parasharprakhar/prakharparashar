import { motion } from "framer-motion";
import { awards } from "@/data/portfolio";
import { Trophy } from "lucide-react";

const AwardsSection = () => {
  return (
    <section id="awards" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">Recognition</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-8">Awards & Achievements</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-lg bg-card border border-amber-500/20 hover:border-amber-400/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{award.title}</p>
                  <p className="text-xs text-muted-foreground">{award.org} • {award.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
