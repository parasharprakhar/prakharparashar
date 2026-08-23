import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINES = [
  "INITIALIZING CORE...",
  "LOADING PROFILE: PRAKHAR PARASHAR...",
  "13+ YEARS INDEXED...",
  "STATUS: ONLINE",
];

interface Props {
  onDone: () => void;
}

const BootSequence = ({ onDone }: Props) => {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers = LINES.map((_, i) =>
      window.setTimeout(() => setVisible(i + 1), 300 * (i + 1))
    );
    const end = window.setTimeout(onDone, 1700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background core-circuit"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-lg px-6 font-mono text-sm">
        {LINES.slice(0, visible).map((line) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary mb-2"
          >
            <span className="text-muted-foreground">&gt;&nbsp;</span>
            {line}
          </motion.p>
        ))}
        <span className="inline-block w-2 h-4 bg-accent align-middle animate-pulse" />
      </div>
      <button
        onClick={onDone}
        className="absolute bottom-8 right-8 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
      >
        Skip &rarr;
      </button>
    </motion.div>
  );
};

export default BootSequence;
