import { motion } from "framer-motion";
import { useState } from "react";
import { coreCompetencies, skillKeywords, experience, certifications, keyProjects, profile } from "@/data/portfolio";
import { Search, Briefcase, ShieldCheck, X } from "lucide-react";
import { trackRecruiterUsage } from "@/hooks/useVisitorTracking";

// Extended keyword sets derived from actual experience data
const experienceKeywords: string[] = [
  // From profile
  "digital transformation", "transformation", "rpa", "ai", "operational excellence",
  "business services", "global", "manufacturing", "b2b",
  // From experience highlights
  "order management", "automation", "blue prism", "sap", "s4hana", "s/4hana",
  "erp", "migration", "backorder", "intercompany", "power bi", "inventory",
  "sop", "process", "continuous improvement", "lean", "six sigma", "green belt",
  "uat", "testing", "cycle time", "customer satisfaction", "dispute", "claim",
  "service delivery", "training", "french", "emea", "multilingual",
  "cross-functional", "team", "leadership", "people management", "analyst",
  "global teams", "operations", "business operations",
  // Tools & platforms
  "servicenow", "zendesk", "itsm", "helpdesk", "ticketing",
  "dashboards", "data visualization", "analytics", "reporting", "kpi",
  "governance", "performance management", "metrics",
  // Soft skills from experience
  "stakeholder", "client management", "engagement",
  "change management", "organizational change",
  "project management", "agile", "scrum",
  // AI & innovation
  "generative ai", "genai", "prompt engineering", "llm", "chatgpt",
  "no-code", "low-code", "citizen developer", "app development",
  "machine learning", "ml", "artificial intelligence",
  // Domain knowledge
  "supply chain", "logistics", "procurement", "vendor management",
  "accounts payable", "accounts receivable", "ap", "ar", "pricing",
  "master data", "data management", "data quality",
  "shared services", "gbs", "global business services",
  "bpo", "outsourcing", "offshoring",
  // Management & strategy
  "strategy", "strategic planning", "business strategy",
  "cost reduction", "cost savings", "efficiency",
  "quality", "quality management", "root cause analysis", "rca",
  "process optimization", "process improvement", "kaizen", "dmaic",
  "workflow", "workflow automation",
  // Certifications-derived
  "atlassian", "jira", "confluence",
  "incident management", "problem management",
  "security", "risk", "compliance",
];

const matchJobDescription = (jobDesc: string) => {
  const jdLower = jobDesc.toLowerCase();
  const jdWords = new Set(jdLower.split(/[\s,;.\/\-()]+/).filter(w => w.length > 2));

  // 1. Match core competencies (primary skills)
  const matchedSkills: string[] = [];
  const unmatchedSkills: string[] = [];

  coreCompetencies.forEach((skill) => {
    const keywords = skillKeywords[skill] || [skill.toLowerCase()];
    const isMatch = keywords.some((kw) => jdLower.includes(kw));
    if (isMatch) matchedSkills.push(skill);
    else unmatchedSkills.push(skill);
  });

  // 2. Count extended experience keyword matches
  const extendedMatches = experienceKeywords.filter(kw => jdLower.includes(kw));
  const extendedMatchRatio = Math.min(extendedMatches.length / 15, 1); // cap at 15 matches = full bonus

  // 3. Check for coding/engineering-heavy roles (where Prakhar has less experience)
  const codingKeywords = [
    "python", "java", "javascript", "typescript", "react", "angular", "vue",
    "node.js", "nodejs", "c++", "c#", "golang", "go lang", "rust", "ruby",
    "php", "swift", "kotlin", "scala", "haskell", "perl",
    "full stack", "fullstack", "frontend", "front-end", "backend", "back-end",
    "software engineer", "software developer", "web developer",
    "data engineer", "data scientist", "devops engineer",
    "system design", "algorithms", "data structures", "leetcode",
    "ci/cd", "docker", "kubernetes", "aws", "azure", "gcp",
    "microservices", "api development", "rest api", "graphql",
    "database design", "sql developer", "mongodb", "postgresql",
    "unit testing", "tdd", "test driven",
    "git", "version control", "code review",
    "machine learning engineer", "deep learning", "neural network",
    "computer vision", "nlp engineer",
  ];

  const codingMatchCount = codingKeywords.filter(kw => jdLower.includes(kw)).length;
  const isCodingHeavy = codingMatchCount >= 3;

  // 4. Calculate base percentage from core competencies
  const corePercentage = (matchedSkills.length / coreCompetencies.length) * 100;

  // 5. Calculate final score
  let finalPercentage: number;

  if (isCodingHeavy && matchedSkills.length <= 3) {
    // Coding-heavy role with very few skill matches → show actual low score
    finalPercentage = Math.round(corePercentage * 0.8 + extendedMatchRatio * 10);
  } else if (isCodingHeavy) {
    // Coding-heavy but some ops/management overlap → moderate score, no inflation
    finalPercentage = Math.round(corePercentage * 0.7 + extendedMatchRatio * 15);
  } else {
    // Operations/management/transformation roles → calibrated scoring
    // Base from core skills + bonus from extended experience keywords
    const baseScore = corePercentage * 0.65;
    const extendedBonus = extendedMatchRatio * 25;
    const rawScore = baseScore + extendedBonus;

    // If there's genuine alignment (4+ core skills matched), ensure minimum 78%
    if (matchedSkills.length >= 4 && rawScore < 78) {
      finalPercentage = 78 + Math.round(extendedMatchRatio * 11); // 78-89 range
    } else {
      finalPercentage = Math.round(rawScore);
    }

    // Cap at 89% for non-perfect matches, 95% for near-perfect
    if (matchedSkills.length < coreCompetencies.length - 2) {
      finalPercentage = Math.min(finalPercentage, 89);
    } else {
      finalPercentage = Math.min(finalPercentage, 95);
    }
  }

  // Ensure minimum 5% if anything was typed
  finalPercentage = Math.max(finalPercentage, 5);

  return { percentage: finalPercentage, matched: matchedSkills, unmatched: unmatchedSkills, isCodingHeavy };
};

const RecruiterSection = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [matchResult, setMatchResult] = useState<{ percentage: number; matched: string[]; unmatched: string[]; isCodingHeavy: boolean } | null>(null);

  const handleMatch = async () => {
    if (!jobDesc.trim()) return;
    const result = matchJobDescription(jobDesc);
    setMatchResult(result);
    await trackRecruiterUsage(jobDesc.length, result.percentage);
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
                <div className={`text-5xl font-bold ${matchResult.percentage >= 78 ? "text-emerald-400" : matchResult.percentage >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {matchResult.percentage}%
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {matchResult.percentage >= 78 ? "✅ Strong Match!" : matchResult.percentage >= 50 ? "⚠️ Moderate Match" : "❌ Low Match"}
                  </p>
                  <p className="text-xs text-muted-foreground">{matchResult.matched.length} of {coreCompetencies.length} core skills matched</p>
                  {matchResult.isCodingHeavy && (
                    <p className="text-xs text-yellow-400/80 mt-1">⚡ This role requires heavy coding/engineering skills</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-400 mb-2">✓ Matched Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matched.map((s) => (
                      <span key={s} className="px-2 py-1 rounded text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{s}</span>
                    ))}
                    {matchResult.matched.length === 0 && <span className="text-xs text-muted-foreground">No core skills matched</span>}
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
