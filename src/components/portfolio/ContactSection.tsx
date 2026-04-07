import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { Linkedin, Mail, ArrowUpRight, Github, Phone, Lock } from "lucide-react";
import { useState } from "react";
import { trackClick } from "@/hooks/useVisitorTracking";

const ContactSection = () => {
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [visitorPhone, setVisitorPhone] = useState("");
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const handleRevealPhone = () => {
    if (visitorPhone.length >= 10) {
      setPhoneRevealed(true);
      setShowPhoneDialog(false);
      trackClick("phone", "revealed");
    }
  };

  return (
    <section id="contact" className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-6">Get In Touch</h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's build the future of<br />
            <span className="text-gradient">digital transformation.</span>
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Open to conversations about RPA strategy, operational excellence, and AI-driven process innovation.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a href={`mailto:${profile.contact.email}`} onClick={() => trackClick("email", profile.contact.email)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm">
              <Mail className="w-4 h-4" /> Email Me
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer"
              onClick={() => trackClick("linkedin", profile.contact.linkedin)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors text-sm">
              <Linkedin className="w-4 h-4" /> LinkedIn <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer"
              onClick={() => trackClick("github", profile.contact.github)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors text-sm">
              <Github className="w-4 h-4" /> GitHub <ArrowUpRight className="w-3 h-3" />
            </a>
            {phoneRevealed ? (
              <a href={`tel:${profile.contact.phone}`} onClick={() => trackClick("phone", "call")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-sm">
                <Phone className="w-4 h-4" /> {profile.contact.phone}
              </a>
            ) : (
              <button onClick={() => setShowPhoneDialog(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors text-sm">
                <Lock className="w-4 h-4" /> Reveal Phone
              </button>
            )}
          </div>
        </motion.div>

        {showPhoneDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPhoneDialog(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl p-6 w-80">
              <h3 className="text-foreground font-semibold mb-2">Reveal Phone Number</h3>
              <p className="text-xs text-muted-foreground mb-4">Please enter your mobile number to view contact details.</p>
              <input type="tel" value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)}
                placeholder="Your mobile number"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm mb-3 focus:outline-none focus:border-primary" />
              <button onClick={handleRevealPhone} disabled={visitorPhone.length < 10}
                className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors">
                Show Phone Number
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-16 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {profile.name}. Built with purpose.</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
