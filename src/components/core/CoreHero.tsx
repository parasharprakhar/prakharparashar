import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { profile } from "@/data/portfolio";

const RING_PCT: Record<string, number> = {
  "Years Experience": 87,
  "RPA Initiatives": 70,
  "Go-Live Success": 100,
  "SAP Migration Success": 98.7,
  "CSAT Achieved": 97,
};

const Gauge = ({ value, label, pct, delay }: { value: string; label: string; pct: number; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [start, setStart] = useState(false);
  const [display, setDisplay] = useState(0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  // Fallback: never depend solely on the observer — always reveal/animate shortly after mount.
  useEffect(() => {
    if (inView) {
      setStart(true);
      return;
    }
    const t = setTimeout(() => setStart(true), 800);
    return () => clearTimeout(t);
  }, [inView]);

  useEffect(() => {
    if (!start) return;
    if (typeof window === "undefined" || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(pct);
      return;
    }
    const startTime = performance.now();
    const duration = 1100;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      setDisplay(pct * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, pct]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="55" cy="55" r={radius} fill="none" strokeWidth="7" className="stroke-muted" />
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              className="stroke-primary"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference - (circumference * display) / 100,
                filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="core-display text-lg md:text-xl text-foreground">{value}</span>
          </div>
        </div>
        <span className="mt-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground max-w-[9rem]">
          {label}
        </span>
      </motion.div>
    </div>
  );
};


const CoreHero = () => (
  <section id="core-hero" className="relative px-6 pt-28 pb-20 md:pt-36">
    <div className="max-w-6xl mx-auto">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="core-eyebrow mb-4">
        // Core Mode — Command Center
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="core-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] uppercase"
      >
        Prakhar<br />
        <span className="text-primary">Parashar</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 font-mono text-sm md:text-base text-accent"
      >
        Senior SAP &amp; Intelligent Automation Leader
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 max-w-2xl text-muted-foreground text-base md:text-lg"
      >
        {profile.tagline}
      </motion.p>

      <div className="mt-14 core-panel p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Telemetry
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {profile.stats.map((s, i) => (
            <Gauge key={s.label} value={s.value} label={s.label} pct={RING_PCT[s.label] ?? 100} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CoreHero;
