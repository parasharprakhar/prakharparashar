import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { ChevronDown, Download, Star, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import profilePhoto from "@/assets/profile-photo.png";
import ShareDialog from "./ShareDialog";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [shareOpen, setShareOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ avg: 5.0, count: 0 });

  useEffect(() => {
    const loadReviews = async () => {
      const { data } = await supabase.from("feedback").select("rating");
      if (data && data.length > 0) {
        const avg = data.reduce((a, r) => a + r.rating, 0) / data.length;
        setReviewData({ avg: parseFloat(avg.toFixed(1)), count: data.length });
      }
    };
    loadReviews();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="flex-shrink-0">
            <div className="relative">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-primary/40 glow-border">
                <img src={profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold">
                Open to Connect
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-center md:text-left flex-1">
            <p className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-3">// Digital Transformation</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-4">
              <span className="text-foreground">{profile.name.split(" ")[0]}</span><br />
              <span className="text-gradient">{profile.name.split(" ")[1]}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-2">{profile.title}</p>
            <p className="text-muted-foreground/70 text-sm max-w-xl mb-6 font-light">{profile.tagline}</p>

            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(reviewData.avg) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{reviewData.avg} ({reviewData.count} reviews)</span>
              </div>
              <a href="/Prakhar_Parashar_CV.docx" download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-colors">
                <Download className="w-4 h-4" /> Download CV
              </a>
              <button onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mt-12">
          {profile.stats.map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 text-center">
          <div className="inline-block px-5 py-3 rounded-lg bg-card/60 border border-border/50">
            <p className="text-xs text-primary font-mono uppercase tracking-wider mb-1">📅 Availability</p>
            <p className="text-xs text-muted-foreground"><span className="text-foreground/80">Weekdays:</span> {profile.availability.weekdays}</p>
            <p className="text-xs text-muted-foreground"><span className="text-foreground/80">Weekends:</span> {profile.availability.weekends}</p>
          </div>
        </motion.div>

        <motion.a href="#about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="flex justify-center mt-10 text-muted-foreground hover:text-primary transition-colors animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </motion.a>
      </div>

      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} />
    </section>
  );
};

export default HeroSection;
