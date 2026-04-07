import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { coreCompetencies, skillKeywords } from "@/data/portfolio";
import { trackKeyword } from "@/hooks/useVisitorTracking";

const SkillSearch = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        trackKeyword(value.trim(), "skill_search");
      }, 2000);
    }
  };

  const filtered = query.trim()
    ? coreCompetencies.filter((skill) => {
        const q = query.toLowerCase();
        if (skill.toLowerCase().includes(q)) return true;
        const kws = skillKeywords[skill] || [];
        return kws.some((kw) => kw.includes(q));
      })
    : [];

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 border border-border text-sm">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search skills..."
          className="bg-transparent text-foreground text-xs outline-none w-28 placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }}>
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 w-64 bg-card border border-border rounded-lg shadow-xl z-50 max-h-52 overflow-y-auto">
          {filtered.map((skill) => (
            <button
              key={skill}
              onClick={() => {
                const el = document.getElementById("skills");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                setOpen(false);
                setQuery(skill);
              }}
              className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors border-b border-border/50 last:border-0"
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute top-full mt-1 left-0 w-64 bg-card border border-border rounded-lg shadow-xl z-50 p-3">
          <p className="text-xs text-muted-foreground">No matching skills found</p>
        </div>
      )}
    </div>
  );
};

export default SkillSearch;
