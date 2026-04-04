import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-3">About</h2>
          <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed">
            {profile.summary}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
