import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { Linkedin, Mail, ArrowUpRight } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-6">Get In Touch</h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's build the future of
            <br />
            <span className="text-gradient">digital transformation.</span>
          </p>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Open to conversations about RPA strategy, operational excellence, and AI-driven process innovation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${profile.contact.phone}@email.com`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email Me
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. Built with purpose.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
