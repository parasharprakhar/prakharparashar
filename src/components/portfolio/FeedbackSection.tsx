import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [publicFeedback, setPublicFeedback] = useState<any[]>([]);

  useEffect(() => {
    const loadFeedback = async () => {
      const { data } = await supabase
        .from("feedback")
        .select("*")
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setPublicFeedback(data);
    };
    loadFeedback();

    // Real-time subscription for live updates
    const channel = supabase
      .channel("public-feedback")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feedback" },
        (payload) => {
          const newFeedback = payload.new as any;
          if (newFeedback.rating >= 4) {
            setPublicFeedback((prev) => [newFeedback, ...prev].slice(0, 10));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [submitted]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    await supabase.from("feedback").insert({
      rating,
      feedback_text: feedback || null,
      visitor_name: name || null,
      visitor_city: city || null,
      visitor_company: company || null,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <p className="text-2xl mb-2">🙏</p>
            <p className="text-foreground font-semibold">Thank you for your feedback!</p>
            <p className="text-sm text-muted-foreground mt-1">Your response has been recorded.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="feedback" className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-5 rounded-xl bg-card border border-border">
            <p className="text-xs text-primary font-mono uppercase tracking-wider mb-1">Visitor Feedback</p>
            <p className="text-xs text-muted-foreground mb-4">
              📝 This is only for my continued learning. No email ID is required or collected.
            </p>

            <div className="flex items-center gap-1 mb-4">
              <span className="text-xs text-muted-foreground mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      i <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-muted-foreground ml-2">
                {rating === 5 ? "Achiever" : rating === 4 ? "Great" : rating === 3 ? "Good" : rating === 2 ? "Fair" : rating === 1 ? "Needs Improvement" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name (optional)"
                className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary" />
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (optional)"
                className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary" />
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (optional)"
                className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary" />
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, 400))}
              placeholder="Share your thoughts (optional, 400 char limit)"
              className="w-full h-20 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs resize-none focus:outline-none focus:border-primary mb-3"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{feedback.length}/400</span>
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Public feedback display */}
          {publicFeedback.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">What visitors say</p>
              {publicFeedback.map((f) => (
                <div key={f.id} className="p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-3 h-3 ${i <= f.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-foreground font-medium">{f.visitor_name || "Anonymous"}</span>
                    {f.visitor_company && <span className="text-xs text-muted-foreground">• {f.visitor_company}</span>}
                  </div>
                  {f.feedback_text && <p className="text-xs text-muted-foreground">{f.feedback_text}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeedbackSection;
