import { useState } from "react";
import { Palette } from "lucide-react";
import type { ThemeMode } from "@/hooks/useTheme";

const themes: { id: ThemeMode; label: string; colors: string[] }[] = [
  { id: "dark", label: "Neon Dark", colors: ["#0a0e14", "#00d4aa", "#8b5cf6"] },
  { id: "light", label: "Clean Light", colors: ["#fafbfc", "#0891b2", "#6366f1"] },
  { id: "midnight", label: "Midnight", colors: ["#0f172a", "#3b82f6", "#f59e0b"] },
  { id: "ocean", label: "Deep Ocean", colors: ["#0c2340", "#2dd4bf", "#f472b6"] },
];

interface ThemeToggleProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

const ThemeToggle = ({ theme, setTheme }: ThemeToggleProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        title="Feeling bored? Change the theme!"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 p-3">
          <p className="text-[10px] text-muted-foreground mb-2 text-center">
            🎨 Bored? Switch it up!
          </p>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                theme === t.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <div className="flex gap-0.5">
                {t.colors.map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              {t.label}
              {theme === t.id && <span className="ml-auto text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
