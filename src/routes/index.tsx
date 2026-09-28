import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Check,
  Download,
  ExternalLink,
  Linkedin,
  Mail,
  Moon,
  Send,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

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

function VocabProPreview() {
  const ref = useRef<HTMLDivElement>(null);
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
    <div ref={ref} className="device-shell" aria-label="VocabPro live preview">
      <div className="device-bar"><span /><span>VOCABPRO / LIVE PRODUCT</span><span /></div>
      <div className="device-screen">
        {visible ? (
          <div className="preview-placeholder">
            <div className="preview-mark">VP</div>
            <p className="eyebrow">LIVE PREVIEW READY</p>
            <h3>VocabPro</h3>
            <p>Public app URL required to activate this secure embed.</p>
          </div>
        ) : <span className="text-sm text-muted-foreground">Loading preview…</span>}
      </div>
    </div>
  );
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
    const form = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: form.get("name"), email: form.get("email"), message: form.get("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setStatus("sending");
    const { error: submissionError } = await supabase.from("contact_submissions").insert(parsed.data);
    if (submissionError) {
      setStatus("error");
      setError("Your message could not be sent. Please email Prakhar directly.");
      return;
    }
    event.currentTarget.reset();
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
  return (
    <main>
      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Prakhar Parashar, back to top">PP</a>
        <nav aria-label="Portfolio sections">
          <a href="#record">Record</a><a href="#work">Work</a><a href="#capabilities">Capabilities</a><a href="#contact">Contact</a>
        </nav>
        <ThemeToggle />
      </header>

      <section id="top" className="hero">
        <div className="hero-rule"><span>OPERATING RECORD / 2026</span><span>BENGALURU, INDIA</span></div>
        <div className="hero-copy">
          <p className="eyebrow">OPERATIONS × AUTOMATION × TRANSFORMATION</p>
          <h1>Prakhar<br />Parashar</h1>
          <p className="hero-title">Senior Operations & Digital Transformation Leader <span>|</span> RPA Programme Lead <span>|</span> GBTS Automation Ambassador</p>
          <p className="hero-positioning">13+ years in international, abroad-facing operations and customer service — with deep RPA, automation, and Order-to-Cash transformation expertise built at Mann+Hummel.</p>
          <div className="hero-actions">
            <Button asChild size="lg"><a href="#" aria-label="Download resume placeholder"><Download /> Download Resume</a></Button>
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
        <SectionHeading number="01" title="Operating mandate" summary="Two career threads. One transformation mandate." />
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
        <SectionHeading number="02" title="Impact, measured" summary="Transformation outcomes, not activity counts." />
        <div className="metrics-grid">
          {achievements.map((item, index) => <article key={item.metric + item.label} className={index < 2 ? "metric-featured" : ""}><strong>{item.metric}</strong><h3>{item.label}</h3><p>{item.detail}</p></article>)}
        </div>
      </section>

      <section id="work" className="section-shell vocab-section">
        <SectionHeading number="03" title="Product proof" summary="A working solution designed around a real operating constraint." />
        <div className="vocab-grid">
          <div className="vocab-copy">
            <p className="eyebrow">FEATURED / GENERATIVE AI</p>
            <h2>VocabPro</h2>
            <p className="vocab-lead">A generative-AI dictionary app conceived and built to bridge terminology gaps across Order Management, AR, AP, Pricing, and Master Data teams, reducing communication errors and accelerating onboarding.</p>
            <ul className="feature-list">
              {[["01", "Home"], ["02", "Teams"], ["03", "Learn"], ["04", "Play — gamified vocabulary learning"], ["05", "VocabBot — in-app chatbot"]].map(([num, text]) => <li key={num}><span>{num}</span>{text}</li>)}
            </ul>
            <p className="built-line">Built no-code, shipped to the org, used daily by cross-functional teams.</p>
            <Button variant="outline" disabled title="Add the verified public VocabPro URL to activate"><ExternalLink /> Launch full app</Button>
          </div>
          <VocabProPreview />
        </div>
      </section>

      <section className="section-shell compact-section">
        <SectionHeading number="04" title="Selected programmes" />
        <div className="project-list">
          <article><span>01</span><div><h3>Part Convergence Project</h3><p>Resolved a systemic SAP/customer part-name mismatch causing chronic shipment errors.</p></div><ArrowUpRight /></article>
          <article><span>02</span><div><h3>Cybersecurity & Customer Service Training</h3><p>Designed and delivered to 53 GBTS-OM staff, establishing first-line phishing defence.</p></div><ArrowUpRight /></article>
          <article><span>03</span><div><h3>EDI Failure Root Cause Analysis</h3><p>Delivered a permanent process fix with zero repeat occurrences.</p></div><ArrowUpRight /></article>
        </div>
      </section>

      <section id="capabilities" className="section-shell section-tinted">
        <SectionHeading number="05" title="Capability system" summary="The disciplines required to move from operating problem to adopted solution." />
        <div className="skills-grid">
          {skills.map(([title, ...items], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></article>)}
        </div>
      </section>

      <section className="section-shell credentials-section">
        <SectionHeading number="06" title="Credentials & recognition" />
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
            <span aria-disabled="true"><Linkedin /> LinkedIn profile forthcoming</span>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer><span>© 2026 PRAKHAR PARASHAR</span><span>OPERATIONS / AUTOMATION / TRANSFORMATION</span><a href="#top">BACK TO TOP <ArrowUpRight /></a></footer>
    </main>
  );
}