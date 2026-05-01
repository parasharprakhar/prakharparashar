import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let id = sessionStorage.getItem("pp_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("pp_session_id", id);
  }
  return id;
};

export const trackClick = async (elementType: string, elementLabel?: string) => {
  const sessionId = sessionStorage.getItem("pp_session_id") || "unknown";
  await supabase.from("page_clicks").insert({
    session_id: sessionId,
    element_type: elementType,
    element_label: elementLabel || null,
  });
};

export const trackKeyword = async (keyword: string, source: string = "skill_search") => {
  await supabase.from("search_keywords").insert({ keyword, source });
};

export const trackRecruiterUsage = async (jobDescLength: number, matchPercentage: number) => {
  await supabase.from("recruiter_usage").insert({
    job_description_length: jobDescLength,
    match_percentage: matchPercentage,
  });
};

export const useVisitorTracking = () => {
  const sessionId = useRef(getSessionId());
  const startTime = useRef(Date.now());
  const recordId = useRef<string | null>(null);

  useEffect(() => {
    const createSession = async () => {
      const { data } = await supabase
        .from("visitor_sessions")
        .insert({
          session_id: sessionId.current,
          user_agent: navigator.userAgent,
        })
        .select("id")
        .single();
      if (data) recordId.current = data.id;
    };
    createSession();

    const updateSession = async () => {
      if (!sessionId.current) return;
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      const reachedBottom = scrollDepth >= 90;

      await (supabase as any).rpc("update_visitor_session", {
        _session_id: sessionId.current,
        _duration_seconds: duration,
        _max_scroll_depth: Number.isFinite(scrollDepth) ? scrollDepth : 0,
        _reached_bottom: reachedBottom,
      });
    };

    const interval = setInterval(updateSession, 15000);

    const handleBeforeUnload = () => updateSession();
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      sessionStorage.setItem("pp_max_scroll", String(Math.max(
        scrollDepth,
        parseInt(sessionStorage.getItem("pp_max_scroll") || "0")
      )));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("scroll", handleScroll);
      updateSession();
    };
  }, []);
};
