import { motion } from "framer-motion";
import { useState } from "react";
import { coreCompetencies, skillKeywords } from "@/data/portfolio";
import { Search, Briefcase, ShieldCheck, X } from "lucide-react";
import { trackRecruiterUsage } from "@/hooks/useVisitorTracking";

const RecruiterSection = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [matchResult, setMatchResult] = useState<{ percentage: number; matched: string[]; unmatched: string[] } | null>(null);

  const handleMatch = async () => {
    if (!jobDesc.trim()) return;
    const jdLower = jobDesc.toLowerCase();
    const matched: string[] = [];
    const unmatched: string[] = [];

    coreCompetencies.forEach((skill) => {
      const keywords = skillKeywords[skill] || [skill.toLowerCase()];
      const isMatch = keywords.some((kw) => jdLower.includes(kw));
      if (isMatch) matched.push(skill);
      else unmatched.push(skill);
    });

    const percentage = Math.round((matched.length / coreCompetencies.length) * 100);
    setMatchResult({ percentage, matched, unmatched });
    await trackRecruiterUsage(jobDesc.length, percentage);
  };

  return (
    <section id="recruiter" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">For Recruiters</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            <Briefcase className="inline w-7 h-7 mr-2 text-primary" />
            Job Role Matching Tool
          </p>
          <div className="flex items-start gap-2 mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-300/80">
              🔒 <strong>Privacy Notice:</strong> Your job description is processed entirely in your browser. No data is stored, sent to any server, or recorded. This tool is completely safe and private.
            </p>
          </div>

          <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here to see skill match percentage..."
            className="w-full h-36 px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary transition-colors" />
          <div className="flex gap-3 mt-3">
            <button onClick={handleMatch} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Search className="inline w-4 h-4 mr-1" /> Analyze Match
            </button>
            {matchResult && (
              <button onClick={() => { setMatchResult(null); setJobDesc(""); }}
                className="px-4 py-2.5 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">
                <X className="inline w-4 h-4 mr-1" /> Clear
              </button>
            )}
          </div>

          {matchResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-bold ${matchResult.percentage >= 87 ? "text-emerald-400" : matchResult.percentage >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                  {matchResult.percentage}%
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {matchResult.percentage >= 87 ? "✅ Strong Match!" : matchResult.percentage >= 60 ? "⚠️ Moderate Match" : "❌ Low Match"}
                  </p>
                  <p className="text-xs text-muted-foreground">{matchResult.matched.length} of {coreCompetencies.length} skills matched</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-400 mb-2">✓ Matched Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matched.map((s) => (
                      <span key={s} className="px-2 py-1 rounded text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">○ Other Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.unmatched.map((s) => (
                      <span key={s} className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RecruiterSection;
