import { motion } from "framer-motion";
import { coreCompetencies, skillKeywords } from "@/data/portfolio";

const CLUSTERS: { name: string; match: string[] }[] = [
  {
    name: "RPA & Automation",
    match: [
      "RPA Programme Management",
      "Blue Prism (Business SME + Dev)",
      "Power Automate",
      "Intelligent Automation Design",
      "AI-Supported Automation",
      "Automation ROI & FTE Benefit",
      "Digital Transformation",
    ],
  },
  {
    name: "AI & GenAI",
    match: [
      "Generative AI (Prompt Engineering)",
      "Claude AI / ChatGPT",
      "No-Code / GenAI App Development",
      "Decipher & Nanonets",
    ],
  },
  {
    name: "SAP & Process Excellence",
    match: [
      "SAP S/4HANA Transformation",
      "Order-to-Cash (O2C)",
      "GBS – OM & CS",
      "EDI Systems",
      "Process Re-engineering",
      "Lean Six Sigma (Green Belt)",
      "Root Cause Analysis",
      "UAT Lead",
      "SOP Development",
      "Global Process Standardisation",
    ],
  },
  {
    name: "Leadership & Tools",
    match: [
      "Operations Management",
      "Global People Management (17+)",
      "Cross-functional Leadership",
      "Change Management",
      "Stakeholder Management",
      "Power BI",
      "KPI Governance",
      "ServiceNow",
      "Zendesk",
      "Jira & Clockify",
      "SharePoint",
    ],
  },
];

const CoreSkillDie = () => {
  const assigned = new Set(CLUSTERS.flatMap((c) => c.match));
  const clusters = CLUSTERS.map((c, i) => ({
    ...c,
    skills: c.match.filter((s) => coreCompetencies.includes(s)).concat(
      i === CLUSTERS.length - 1 ? coreCompetencies.filter((s) => !assigned.has(s)) : []
    ),
  }));

  return (
    <section id="core-skills" className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <p className="core-eyebrow mb-3">// Skill Die Map</p>
        <h2 className="core-display text-3xl md:text-4xl text-foreground mb-10">Processor Layout</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {clusters.map((cluster) => (
            <div key={cluster.name} className="core-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-4">{cluster.name}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cluster.skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    tabIndex={0}
                    title={`${skill}${skillKeywords[skill] ? ` — ${skillKeywords[skill].slice(0, 4).join(", ")}` : ""}`}
                    className="group relative rounded-md border border-border bg-secondary/40 px-2 py-3 text-center cursor-default transition-all hover:border-primary hover:bg-primary/10 hover:core-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-mono text-[10px] leading-tight text-muted-foreground group-hover:text-foreground block">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreSkillDie;
