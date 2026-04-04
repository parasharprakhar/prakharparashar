import { motion } from "framer-motion";
import { awards } from "@/data/portfolio";
import { Trophy } from "lucide-react";

const AwardsSection = () => {
  return (
    <section id="awards" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-12">Awards & Recognition</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-all glow-border"
            >
              <Trophy className="w-5 h-5 text-primary mx-auto mb-3" />
              <p className="font-semibold text-foreground text-sm">{award.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{award.org} · {award.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
