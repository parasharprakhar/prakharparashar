import { useState } from "react";
import { Mail, Linkedin, Github, Download, Phone, Lock } from "lucide-react";
import { profile } from "@/data/portfolio";
import { trackClick } from "@/hooks/useVisitorTracking";
import cvFile from "@/assets/Prakhar_Parashar_CV.docx?url";

const btn =
  "inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const CoreTerminal = () => {
  const [dialog, setDialog] = useState(false);
  const [visitorPhone, setVisitorPhone] = useState("");
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    if (visitorPhone.length >= 10) {
      setRevealed(true);
      setDialog(false);
      trackClick("phone", "revealed");
    }
  };

  return (
    <section id="core-contact" className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <p className="core-eyebrow mb-3">// Terminal</p>
        <div className="core-panel p-6 md:p-8">
          <div className="flex gap-2 mb-6" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>

          <p className="font-mono text-sm text-primary">
            <span className="text-muted-foreground">$ </span>connect --with prakhar
            <span className="ml-1 inline-block w-2 h-4 bg-accent align-middle animate-pulse" />
          </p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Availability (IST): {profile.availability.weekdays}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.contact.email}`} onClick={() => trackClick("email", profile.contact.email)} className={btn}>
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer"
              onClick={() => trackClick("linkedin", profile.contact.linkedin)} className={btn}>
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer"
              onClick={() => trackClick("github", profile.contact.github)} className={btn}>
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={cvFile} download="Prakhar_Parashar_CV.docx" onClick={() => trackClick("cv", "download")} className={btn}>
              <Download className="w-4 h-4" /> Download CV
            </a>
            {revealed ? (
              <a href={`tel:${profile.contact.phone}`} onClick={() => trackClick("phone", "call")} className={btn}>
                <Phone className="w-4 h-4" /> {profile.contact.phone}
              </a>
            ) : (
              <button onClick={() => setDialog(true)} className={btn}>
                <Lock className="w-4 h-4" /> Reveal Phone
              </button>
            )}
          </div>
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {profile.name} — Core Mode
        </p>
      </div>

      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
          onClick={() => setDialog(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Reveal phone number"
        >
          <div onClick={(e) => e.stopPropagation()} className="core-panel p-6 w-full max-w-sm">
            <h3 className="text-foreground font-semibold mb-2">Reveal Phone Number</h3>
            <p className="text-xs text-muted-foreground mb-4">Please enter your mobile number to view contact details.</p>
            <label htmlFor="core-phone" className="sr-only">Your mobile number</label>
            <input
              id="core-phone"
              type="tel"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              placeholder="Your mobile number"
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm mb-3 focus:outline-none focus:border-primary"
            />
            <button
              onClick={reveal}
              disabled={visitorPhone.length < 10}
              className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              Show Phone Number
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CoreTerminal;
