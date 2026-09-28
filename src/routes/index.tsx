import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Moon,
  Plus,
  Send,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import vocabProPreview from "@/assets/vocabpro-live-preview.png.asset.json";

const description =
  "Senior operations and digital transformation leader specializing in RPA, intelligent automation, SAP S/4HANA, and Order-to-Cash transformation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prakhar Parashar — Automation & RPA Programme Leader" },
      { name: "description", content: description },
      { property: "og:title", content: "Prakhar Parashar — Automation & RPA Programme Leader" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const achievements = [
  {
    metric: "99.8%",
    label: "cycle-time reduction",
    detail: "Return Analysis Automation · 2 days → 5 minutes · Blue Prism RPA",
  },
  {
    metric: "7 / 7",
    label: "RPA initiatives delivered",
    detail: "Business SME & UAT Lead · 100% on-time go-live · zero rework",
  },
  {
    metric: "98.7%",
    label: "successful S/4HANA go-live",
    detail: "Global POC & UAT Lead · zero revenue-impacting disruption",
  },
  {
    metric: "$19M → <$1M",
    label: "backorder reduction",
    detail: "Delivered 3 months ahead of schedule",
  },
  {
    metric: "8 / 4",
    label: "countries / continents",
    detail: "Single-handed cross-regional process, training & documentation stabilization",
  },
  {
    metric: "12 / 40%",
    label: "countries / effort reduced",
    detail: "Global SOP standardisation and manual effort reduction",
  },
  {
    metric: "85% → 98%",
    label: "inventory accuracy",
    detail: "Power BI operational dashboards",
  },
  {
    metric: "2,000+",
    label: "issues resolved",
    detail: "Post-migration issues cleared within 3 days",
  },
];

const programmes = [
  {
    title: "Part Convergence Project",
    summary: "Resolved a systemic SAP/customer part-name mismatch causing chronic shipment errors.",
    details: [
      ["Problem", "A systemic mismatch between SAP and customer part names was causing chronic shipment errors."],
      ["Response", "Led the Part Convergence Project to resolve the underlying naming mismatch."],
      ["Result", "Resolved the systemic cause of the shipment errors."],
    ],
  },
  {
    title: "Cybersecurity & Customer Service Training",
    summary: "Designed and delivered to 53 GBTS-OM staff, establishing first-line phishing defence.",
    details: [
      ["Problem", "Customer service teams needed stronger first-line awareness of phishing risk."],
      ["Response", "Designed and delivered a cybersecurity and customer service training programme to 53 GBTS-OM staff."],
      ["Result", "Established a first-line phishing defence across the trained team."],
    ],
  },
  {
    title: "EDI Failure Root Cause Analysis",
    summary: "Delivered a permanent process fix with zero repeat occurrences.",
    details: [
      ["Problem", "EDI failures required a root-cause response rather than another temporary correction."],
      ["Response", "Conducted root cause analysis and implemented a permanent process fix."],
      ["Result", "Zero repeat occurrences."],
    ],
  },
];

const vocabProUrl = "https://web-builder-buddy-184.lovable.app";
const resumeUrl = "https://prakharparashar.lovable.app/assets/Prakhar_Parashar_CV-_plRxiEH.docx";

const skills = [
  ["Automation & RPA", "Blue Prism (Business SME)", "RPA Programme Management", "Process Discovery", "Intelligent Automation Design"],
  ["SAP & Transformation", "SAP S/4HANA Transformation", "UAT Leadership", "Change Management"],
  ["AI & No-Code", "Generative AI (Prompt Engineering)", "No-Code/GenAI App Development", "AI-Supported Automation"],
  ["Process Excellence", "Lean Six Sigma (Green Belt)", "Root Cause Analysis", "SOP Development", "Global Process Standardisation"],
  ["Leadership & Delivery", "Global People Management (17+)", "Cross-functional Stakeholder Management", "KPI Governance", "Program Delivery"],
];

const certifications = [
  ["Build Your Own AI Agent, No-Code", "LinkedIn · Mar 2026"],
  ["Generative AI Tools", "Microsoft · Dec 2025"],
  ["Blue Prism Developer", "SS&C Blue Prism · Oct 2025"],
  ["Lean Six Sigma with AI — Green Belt", "LinkedIn · Sep 2025"],
  ["Root Cause Analysis", "PMI · Sep 2025"],
  ["Security Risks in AI & ML", "LinkedIn · May 2025"],
  ["Atlassian Agile Project Management Professional", "Feb 2025"],
  ["ServiceNow IT Leadership Professional", "Dec 2024"],
  ["Zendesk Customer Service Professional", "Dec 2024"],
  ["SAP S/4HANA Essential Training", "LinkedIn · Aug 2024"],
  ["Intelligent Automation Foundations", "LinkedIn · Apr 2024"],
  ["Process Discovery for RPA", "LinkedIn · Apr 2024"],
];

const awards = [
  ["GBTS Automation Ambassador — Appointed", "Mann+Hummel · Aug 2025"],
  ["Best Team Award", "Mann+Hummel · Sep 2025"],
  ["Operational Excellence Award ×3", "Mann+Hummel · 2022, 2023, 2024"],
  ["Pat on the Back Award", "Mann+Hummel · Feb 2024"],
  ["Star of the Month ×2", "Capgemini · 2017, 2018"],
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("pp-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("pp-theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function SectionHeading({ number, title, summary }: { number: string; title: string; summary?: string }) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <h2>{title}</h2>
        {summary ? <p>{summary}</p> : null}
      </div>
    </div>
  );
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options ?? { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function MetricValue({ value }: { value: string }) {
  const { ref, visible } = useInView<HTMLElement>();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const linear = Math.min((now - started) / 1250, 1);
      setProgress(1 - Math.pow(1 - linear, 3));
      if (linear < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [visible]);
  const decimals = value.includes(".") ? 1 : 0;
  const display = value.replace(/\d[\d,.]*/g, (match) => {
    const target = Number(match.replaceAll(",", ""));
    const current = target * progress;
    if (match.includes(",")) return Math.round(current).toLocaleString("en-US");
    return current.toFixed(decimals);
  });
  return <strong ref={ref}>{display}</strong>;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>{children}</div>;
}

function VocabProPreview() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <a ref={ref} className="device-shell vocab-live-link" href={vocabProUrl} target="_blank" rel="noreferrer" aria-label="Open the live VocabPro app in a new tab">
      <div className="device-bar"><span /><span>VOCABPRO / LIVE PRODUCT</span><span /></div>
      <div className="device-screen">
        {visible ? (
          <img src={vocabProPreview.url} alt="VocabPro live app home screen" loading="lazy" />
        ) : <span className="text-sm text-muted-foreground">Loading preview…</span>}
        <span className="vocab-open-cue"><ExternalLink /> Open live app</span>
      </div>
    </a>
  );
}

function AutomationPipeline() {
  const { ref, visible } = useInView<HTMLDivElement>({ threshold: 0.35 });
  return (
    <div ref={ref} className={`automation-pipeline ${visible ? "is-running" : ""}`}>
      <div className="pipeline-heading"><div><p className="eyebrow">BLUE PRISM / DELIVERY RECORD</p><h3>Seven initiatives. Seven on-time go-lives.</h3></div><span>ZERO REWORK</span></div>
      <div className="pipeline-track" aria-label="Seven Blue Prism initiatives delivered">
        {Array.from({ length: 7 }, (_, index) => <div className="pipeline-node" style={{ "--node-index": index } as React.CSSProperties} key={index}><i /><span>0{index + 1}</span><small>GO-LIVE</small></div>)}
      </div>
    </div>
  );
}

function ProgrammeList() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="project-list">{programmes.map((programme, index) => {
    const expanded = open === index;
    return <article className={expanded ? "is-open" : ""} key={programme.title}>
      <button type="button" onClick={() => setOpen(expanded ? null : index)} aria-expanded={expanded} aria-controls={`programme-${index}`}>
        <span>0{index + 1}</span><div><h3>{programme.title}</h3><p>{programme.summary}</p></div><Plus />
      </button>
      <div id={`programme-${index}`} className="programme-detail" hidden={!expanded}>{programme.details.map(([label, text]) => <div key={label}><span>{label}</span><p>{text}</p></div>)}</div>
    </article>;
  })}</div>;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  message: z.string().trim().min(10, "Please add a little more detail.").max(2000),
});

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const parsed = contactSchema.safeParse({
      name: form.get("name"), email: form.get("email"), message: form.get("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setStatus("sending");
    const cloudUrl = import.meta.env['VITE_SUPABASE_URL'];
    const publishableKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
    if (!cloudUrl || !publishableKey) {
      setStatus("error");
      setError("Your message could not be sent. Please email Prakhar directly.");
      return;
    }
    try {
      const response = await fetch(`${cloudUrl}/rest/v1/contact_submissions`, {
        method: "POST",
        headers: {
          apikey: publishableKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error("Contact submission failed");
    } catch {
      setStatus("error");
      setError("Your message could not be sent. Please email Prakhar directly.");
      return;
    }
    formElement.reset();
    setStatus("sent");
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" maxLength={100} required /></div>
      <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" maxLength={255} required /></div>
      <div className="grid gap-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" maxLength={2000} rows={6} required /></div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      {status === "sent" ? <p className="status-success" role="status"><Check /> Message received. Thank you.</p> : null}
      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}<Send />
      </Button>
    </form>
  );
}

function Portfolio() {
  const heroRef = useRef<HTMLElement>(null);
  function moveHero(event: MouseEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--hero-x", `${x * 10}px`);
    event.currentTarget.style.setProperty("--hero-y", `${y * 8}px`);
  }
  function resetHero() {
    heroRef.current?.style.setProperty("--hero-x", "0px");
    heroRef.current?.style.setProperty("--hero-y", "0px");
  }
  return (
    <main>
      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Prakhar Parashar, back to top">PP</a>
        <nav aria-label="Portfolio sections">
          <a href="#record">Record</a><a href="#work">Work</a><a href="#capabilities">Capabilities</a><a href="#contact">Contact</a>
        </nav>
        <ThemeToggle />
      </header>

       <section ref={heroRef} id="top" className="hero" onMouseMove={moveHero} onMouseLeave={resetHero}>
        <div className="hero-rule"><span>OPERATING RECORD / 2026</span><span>BENGALURU, INDIA</span></div>
        <div className="hero-copy">
          <p className="eyebrow">OPERATIONS × AUTOMATION × TRANSFORMATION</p>
          <h1>Prakhar<br />Parashar</h1>
          <p className="hero-title">Senior Operations & Digital Transformation Leader <span>|</span> RPA Programme Lead <span>|</span> GBTS Automation Ambassador</p>
          <p className="hero-positioning">13+ years in international, abroad-facing operations and customer service — with deep RPA, automation, and Order-to-Cash transformation expertise built at Mann+Hummel.</p>
          <div className="hero-actions">
             <Button asChild size="lg"><a href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Download Prakhar Parashar’s resume"><Download /> Download Resume</a></Button>
            <Button asChild size="lg" variant="outline"><a href="#contact">Contact Me <ArrowDown /></a></Button>
          </div>
        </div>
        <div className="hero-index" aria-label="Career snapshot">
          <div><strong>13+</strong><span>YEARS / INTERNATIONAL OPERATIONS</span></div>
          <div><strong>17+</strong><span>ANALYSTS / CURRENT LEADERSHIP</span></div>
          <div><strong>7</strong><span>BLUE PRISM INITIATIVES / DELIVERED</span></div>
        </div>
      </section>

      <section id="record" className="section-shell">
         <Reveal><SectionHeading number="01" title="Operating mandate" summary="Two career threads. One transformation mandate." /></Reveal>
        <div className="narrative-grid">
          <div className="career-thread">
            <p className="eyebrow">CURRENT SCOPE</p>
            <h3>Leading the operation.<br />Building its next system.</h3>
            <p>Prakhar holds a dual mandate: leading 17+ analysts across GBTS Order Management while serving as GBTS Automation Ambassador, owning the complete RPA & AI pipeline from business case through go-live.</p>
            <p>With no Team Leader currently appointed above him, he covers Team-Leader-level scope in addition to his own programme and operational duties.</p>
          </div>
          <div className="timeline">
            <article className="timeline-active">
              <span>JUL 2025 — PRESENT</span>
              <h3>Senior Operations & Digital Transformation Leader</h3>
              <p>Lead Analyst · RPA Programme Lead</p>
              <small>Mann + Hummel Filters · Bengaluru</small>
            </article>
            <article>
              <span>OCT 2022 — JUN 2025</span>
              <h3>Lead Analyst</h3>
              <p>Mann + Hummel Filters · Bengaluru</p>
            </article>
          </div>
        </div>
        <div className="career-clarifier">
          <div><span>01 / FOUNDATION</span><p><strong>13+ years overall</strong> in international, abroad-facing customer service and operations, including earlier work at Capgemini as a French-language specialist.</p></div>
          <div><span>02 / SPECIALISATION</span><p><strong>Automation, RPA and O2C transformation</strong> expertise was built specifically during the Mann+Hummel tenure.</p></div>
        </div>
      </section>

      <section className="section-shell section-tinted">
         <Reveal><SectionHeading number="02" title="Impact, measured" summary="Transformation outcomes, not activity counts." /></Reveal>
        <div className="metrics-grid">
           {achievements.map((item, index) => <Reveal key={item.metric + item.label} delay={(index % 4) * 80} className={index < 2 ? "metric-featured" : ""}><article><MetricValue value={item.metric} /><h3>{item.label}</h3><p>{item.detail}</p></article></Reveal>)}
        </div>
         <AutomationPipeline />
      </section>

      <section id="work" className="section-shell vocab-section">
         <Reveal><SectionHeading number="03" title="Product proof" summary="A working solution designed around a real operating constraint." /></Reveal>
        <div className="vocab-grid">
          <div className="vocab-copy">
            <p className="eyebrow">FEATURED / GENERATIVE AI</p>
            <h2>VocabPro</h2>
            <p className="vocab-lead">A generative-AI dictionary app conceived and built to bridge terminology gaps across Order Management, AR, AP, Pricing, and Master Data teams, reducing communication errors and accelerating onboarding.</p>
            <ul className="feature-list">
              {[["01", "Home"], ["02", "Teams"], ["03", "Learn"], ["04", "Play — gamified vocabulary learning"], ["05", "VocabBot — in-app chatbot"]].map(([num, text]) => <li key={num}><span>{num}</span>{text}</li>)}
            </ul>
            <p className="built-line">Built no-code, shipped to the org, used daily by cross-functional teams.</p>
             <Button asChild variant="outline"><a href={vocabProUrl} target="_blank" rel="noreferrer"><ExternalLink /> Launch full app</a></Button>
          </div>
          <VocabProPreview />
        </div>
      </section>

      <section className="section-shell compact-section">
         <Reveal><SectionHeading number="04" title="Selected programmes" /></Reveal>
         <ProgrammeList />
      </section>

      <section id="capabilities" className="section-shell section-tinted">
         <Reveal><SectionHeading number="05" title="Capability system" summary="The disciplines required to move from operating problem to adopted solution." /></Reveal>
        <div className="skills-grid">
           {skills.map(([title, ...items], index) => <Reveal key={title} delay={index * 70}><article><span>0{index + 1}</span><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></article></Reveal>)}
        </div>
      </section>

      <section className="section-shell credentials-section">
         <Reveal><SectionHeading number="06" title="Credentials & recognition" /></Reveal>
        <div className="credentials-grid">
          <div><p className="eyebrow">CERTIFICATIONS / 12</p>{certifications.map(([name, issuer]) => <article key={name}><h3>{name}</h3><p>{issuer}</p></article>)}</div>
          <div><p className="eyebrow">AWARDS / 5</p>{awards.map(([name, issuer]) => <article key={name}><h3>{name}</h3><p>{issuer}</p></article>)}</div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-intro">
          <p className="eyebrow">07 / CONTACT</p>
          <h2>Let’s move the<br />operation forward.</h2>
          <p>Open to conversations about Automation Manager, RPA Program Lead, and IC Automation Consultant opportunities.</p>
          <div className="contact-links">
             <a href="mailto:prakharparashar.ai@gmail.com"><Mail /> prakharparashar.ai@gmail.com</a>
             <a href="https://www.linkedin.com/in/prakharparashar" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ExternalLink /></a>
             <a href="https://github.com/parasharprakhar" target="_blank" rel="noreferrer"><Github /> GitHub <ExternalLink /></a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer><span>© 2026 PRAKHAR PARASHAR</span><span>OPERATIONS / AUTOMATION / TRANSFORMATION</span><a href="#top">BACK TO TOP <ArrowUpRight /></a></footer>
    </main>
  );
}