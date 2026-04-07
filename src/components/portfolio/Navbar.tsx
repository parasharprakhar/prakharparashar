import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import SkillSearch from "./SkillSearch";
import ThemeToggle from "./ThemeToggle";
import type { ThemeMode } from "@/hooks/useTheme";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Analytics", href: "#analytics" },
  { label: "Certifications", href: "#certifications" },
  { label: "Awards", href: "#awards" },
  { label: "Recruiter", href: "#recruiter" },
  { label: "Feedback", href: "#feedback" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

const Navbar = ({ theme, setTheme }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="#" className="font-bold text-foreground text-sm tracking-wider">
          PP<span className="text-primary">.</span>
        </a>

        <div className="hidden lg:flex items-center gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
          <SkillSearch />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2">
            <SkillSearch />
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
