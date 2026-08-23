import { motion } from "framer-motion";
import { keyProjects } from "@/data/portfolio";

const CoreModules = () => (
  <section id="core-modules" className="px-6 py-20">
    <div className="max-w-6xl mx-auto">
      <p className="core-eyebrow mb-3">// Deployed Modules</p>
      <h2 className="core-display text-3xl md:text-4xl text-foreground mb-10">
        {keyProjects.length} Modules In Production
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {keyProjects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.06 }}
            className="core-panel p-5 flex flex-col hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span
                  className="w-2 h-2 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 8px 2px hsl(var(--primary) / 0.7)" }}
                  aria-hidden="true"
                />
                Deployed
              </span>
              <span className="font-mono text-[10px] text-accent">{p.year}</span>
            </div>

            <h3 className="text-base font-semibold text-foreground leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{p.description}</p>

            <span className="mt-4 inline-block self-start rounded-md bg-primary/15 border border-primary/40 px-3 py-1 font-mono text-xs font-bold text-primary">
              {p.metric}
            </span>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default CoreModules;
