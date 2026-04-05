import { motion } from "framer-motion";
import { keyProjects } from "@/data/portfolio";
import { Zap } from "lucide-react";

const TAG_COLORS = [
  "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  "bg-purple-500/15 text-purple-300 border-purple-500/20",
  "bg-amber-500/15 text-amber-300 border-amber-500/20",
  "bg-pink-500/15 text-pink-300 border-pink-500/20",
  "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">Projects</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-8">Key Initiatives</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyProjects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-300">{project.metric}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, j) => (
                  <span key={j} className={`px-2 py-0.5 rounded text-[10px] border ${TAG_COLORS[j % TAG_COLORS.length]}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
