import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience } from "@/data/portfolio";

// Ordered oldest -> newest, mapped from the shared experience data source.
const ORDER = [4, 3, 2, 1, 0];

const SHORT_LABELS: Record<string, string> = {
  "Earlier Career (French Specialist & Language Roles)": "Capgemini — Language & Specialist Roles",
  "Senior French Specialist": "Senior French Specialist",
  "Senior Specialist – Operations & Process Standardisation": "Senior Specialist — Ops & Process Standardisation",
  "Lead Analyst – Operations & Process Improvement": "Lead Analyst — Ops & Process Improvement",
  "Senior Operations & Digital Transformation Leader (Senior Lead Analyst | RPA Programme Lead)":
    "Senior Ops & Digital Transformation Leader",
};

const CorePipeline = () => {
  const [open, setOpen] = useState<number | null>(0);
  const nodes = ORDER.map((i) => experience[i]).filter(Boolean);

  return (
    <section id="core-pipeline" className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <p className="core-eyebrow mb-3">// Career Pipeline</p>
        <h2 className="core-display text-3xl md:text-4xl text-foreground mb-10">Automation of a Career</h2>

        <div className="relative">
          {/* connector track */}
          <div className="absolute lg:left-0 lg:right-0 lg:top-7 lg:h-px left-7 top-0 bottom-0 w-px lg:w-auto bg-border" />
          <motion.div
            aria-hidden="true"
            className="absolute rounded-full bg-accent w-2 h-2 lg:top-[22px] left-[22px] lg:left-0"
            style={{ boxShadow: "0 0 12px 2px hsl(var(--accent) / 0.8)" }}
            animate={{ y: [0, 0], x: [0, 0] }}
          >
            <motion.span
              className="block w-2 h-2 rounded-full bg-accent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </motion.div>

          <div className="relative grid gap-6 lg:grid-cols-5">
            {nodes.map((job, i) => {
              const isActive = job.period.includes("Present");
              const isOpen = open === i;
              return (
                <div key={job.role + job.period} className="relative pl-16 lg:pl-0">
                  <div className="relative flex lg:flex-col items-center lg:items-start gap-4">
                    <span
                      className={`absolute lg:static -left-16 lg:left-0 top-1 flex items-center justify-center w-[30px] h-[30px] rounded-full border-2 bg-background ${
                        isActive ? "border-primary" : "border-border"
                      }`}
                      style={isActive ? { animation: "core-pulse-dot 2s infinite" } : undefined}
                    >
                      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground"}`} />
                    </span>
                  </div>

                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className={`mt-4 w-full text-left core-panel p-4 transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isOpen ? "core-glow" : ""
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent block">
                      {job.period}
                    </span>
                    <span className="block mt-2 text-sm font-semibold text-foreground leading-snug">
                      {SHORT_LABELS[job.role] ?? job.role}
                    </span>
                    <span className="block mt-1 text-xs text-muted-foreground">{job.company}</span>
                    {isActive && (
                      <span className="inline-block mt-3 font-mono text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground">
                        ACTIVE
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {open !== null && nodes[open] && (
            <motion.div
              key={open}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="core-panel mt-8 p-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
                  {nodes[open].company} • {nodes[open].location}
                </p>
                <ul className="space-y-2">
                  {nodes[open].highlights.map((h) => (
                    <li key={h} className="text-sm text-muted-foreground flex gap-3">
                      <span className="text-primary font-mono">›</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CorePipeline;
