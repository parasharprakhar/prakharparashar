import { certifications, awards } from "@/data/portfolio";
import { Award, BadgeCheck } from "lucide-react";

const CoreBadges = () => (
  <section id="core-badges" className="px-6 py-20">
    <div className="max-w-6xl mx-auto">
      <p className="core-eyebrow mb-3">// Badge Wall</p>
      <h2 className="core-display text-3xl md:text-4xl text-foreground mb-8">
        Certifications &amp; Trophies
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
        {certifications.map((c) => (
          <div
            key={c.name}
            className="core-panel shrink-0 w-64 p-4 snap-start hover:border-primary transition-colors"
          >
            <BadgeCheck className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-foreground leading-snug">{c.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {c.issuer} • {c.date}
            </p>
            <p className="mt-2 font-mono text-[10px] text-accent">{c.category}</p>
          </div>
        ))}
      </div>

      <p className="core-eyebrow mt-12 mb-4">// Trophy Shelf</p>
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
        {awards.map((a) => (
          <div
            key={a.title}
            className="core-panel shrink-0 w-60 p-4 snap-start hover:border-primary transition-colors"
          >
            <Award className="w-5 h-5 text-accent mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-foreground leading-snug">{a.title}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {a.org} • {a.year}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CoreBadges;
