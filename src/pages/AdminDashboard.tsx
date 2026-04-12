import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  LogOut, Users, MousePointerClick, Star, Search, Briefcase,
  Download, ArrowLeft, Clock, Eye, MessageSquare
} from "lucide-react";

const COLORS = ["hsl(175,80%,50%)", "hsl(280,80%,60%)", "hsl(45,95%,55%)", "hsl(340,80%,55%)", "hsl(140,70%,45%)", "hsl(210,80%,55%)"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [clicks, setClicks] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [recruiterData, setRecruiterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) { navigate("/admin"); return; }
      await loadData();
    };
    checkAuth();
  }, []);

  const loadData = async () => {
    const [s, c, f, k, r] = await Promise.all([
      supabase.from("visitor_sessions").select("*").order("started_at", { ascending: false }).limit(500),
      supabase.from("page_clicks").select("*").order("clicked_at", { ascending: false }).limit(1000),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }),
      supabase.from("search_keywords").select("*").order("searched_at", { ascending: false }).limit(500),
      supabase.from("recruiter_usage").select("*").order("used_at", { ascending: false }),
    ]);
    setSessions(s.data || []);
    setClicks(c.data || []);
    setFeedbackList(f.data || []);
    setKeywords(k.data || []);
    setRecruiterData(r.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(r => Object.values(r).map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllData = () => {
    exportToCSV(sessions, "visitor_sessions.csv");
    exportToCSV(clicks, "page_clicks.csv");
    exportToCSV(feedbackList, "feedback.csv");
    exportToCSV(keywords, "search_keywords.csv");
    exportToCSV(recruiterData, "recruiter_usage.csv");
  };

  // Derived analytics
  const totalVisits = sessions.length;
  const quickBounces = sessions.filter(s => (s.duration_seconds || 0) <= 50).length;
  const engagedVisits = sessions.filter(s => (s.duration_seconds || 0) > 50).length;
  const profileCompletes = sessions.filter(s => s.reached_bottom).length;
  const avgDuration = totalVisits ? Math.round(sessions.reduce((a, s) => a + (s.duration_seconds || 0), 0) / totalVisits) : 0;

  const clicksByType = clicks.reduce((acc, c) => {
    acc[c.element_type] = (acc[c.element_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const clickChartData = Object.entries(clicksByType).map(([name, value]) => ({ name, value }));

  const keywordCounts = keywords.reduce((acc, k) => {
    acc[k.keyword] = (acc[k.keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 15)
    .map(([keyword, count]) => ({ keyword, count }));

  // Daily keyword breakdown
  const dailyKeywords = keywords.reduce((acc, k) => {
    const day = new Date(k.searched_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    if (!acc[day]) acc[day] = {};
    acc[day][k.keyword] = (acc[day][k.keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);
  const dailyKeywordRows = Object.entries(dailyKeywords)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .flatMap(([date, kws]) =>
      Object.entries(kws)
        .sort((a, b) => b[1] - a[1])
        .map(([keyword, count]) => ({ date, keyword, count }))
    );

  // Monthly keyword breakdown
  const monthlyKeywords = keywords.reduce((acc, k) => {
    const month = new Date(k.searched_at).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!acc[month]) acc[month] = {};
    acc[month][k.keyword] = (acc[month][k.keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);
  const monthlyKeywordRows = Object.entries(monthlyKeywords)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .flatMap(([month, kws]) =>
      Object.entries(kws)
        .sort((a, b) => b[1] - a[1])
        .map(([keyword, count]) => ({ month, keyword, count }))
    );

  const avgRating = feedbackList.length
    ? (feedbackList.reduce((a, f) => a + f.rating, 0) / feedbackList.length).toFixed(1)
    : "N/A";

  // Daily visitor trend (last 30 days)
  const dailyVisits = sessions.reduce((acc, s) => {
    const day = new Date(s.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dailyChartData = Object.entries(dailyVisits).slice(-14).map(([date, visits]) => ({ date, visits }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={exportAllData} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-colors">
              <Download className="w-4 h-4" /> Export All CSV
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { icon: Users, label: "Total Visits", value: totalVisits, color: "text-primary" },
            { icon: Clock, label: "Quick Bounce (≤50s)", value: quickBounces, color: "text-red-400" },
            { icon: Eye, label: "Engaged (>50s)", value: engagedVisits, color: "text-emerald-400" },
            { icon: MousePointerClick, label: "Total Clicks", value: clicks.length, color: "text-purple-400" },
            { icon: Star, label: "Avg Rating", value: avgRating, color: "text-yellow-400" },
            { icon: Briefcase, label: "Recruiter Uses", value: recruiterData.length, color: "text-blue-400" },
          ].map((kpi, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Daily Visitors */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">📈 Visitor Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" />
                <XAxis dataKey="date" stroke="hsl(215,12%,55%)" fontSize={10} />
                <YAxis stroke="hsl(215,12%,55%)" fontSize={10} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,8%)", border: "1px solid hsl(220,14%,16%)", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="visits" stroke="hsl(175,80%,50%)" strokeWidth={2} dot={{ fill: "hsl(175,80%,50%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Clicks by Type */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">🖱️ Clicks by Element</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={clickChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value"
                  label={({ name, value }) => `${name} (${value})`} labelLine={{ stroke: "hsl(215,12%,55%)" }}>
                  {clickChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,18%,8%)", border: "1px solid hsl(220,14%,16%)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top Keywords */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">🔍 Top Searched Keywords</h3>
            {topKeywords.length === 0 ? (
              <p className="text-xs text-muted-foreground">No searches yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topKeywords} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" />
                  <XAxis type="number" stroke="hsl(215,12%,55%)" fontSize={10} />
                  <YAxis dataKey="keyword" type="category" stroke="hsl(215,12%,55%)" fontSize={9} width={100} />
                  <Tooltip contentStyle={{ background: "hsl(220,18%,8%)", border: "1px solid hsl(220,14%,16%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="hsl(280,80%,60%)" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Session Duration */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">⏱️ Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-primary">{avgDuration}s</p>
                <p className="text-[10px] text-muted-foreground">Avg Duration</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-emerald-400">{profileCompletes}</p>
                <p className="text-[10px] text-muted-foreground">Full Profile Views</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-yellow-400">{feedbackList.length}</p>
                <p className="text-[10px] text-muted-foreground">Total Feedbacks</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-purple-400">{keywords.length}</p>
                <p className="text-[10px] text-muted-foreground">Total Searches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="p-5 rounded-xl bg-card border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> All Feedback
            </h3>
            <button onClick={() => exportToCSV(feedbackList, "feedback.csv")} className="text-xs text-primary hover:underline">Export</button>
          </div>
          {feedbackList.length === 0 ? (
            <p className="text-xs text-muted-foreground">No feedback yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Rating</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">City</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Company</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((f) => (
                    <tr key={f.id} className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</td>
                      <td className="py-2">
                        <span className={f.rating >= 4 ? "text-yellow-400" : f.rating >= 3 ? "text-muted-foreground" : "text-red-400"}>
                          {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                        </span>
                      </td>
                      <td className="py-2 text-foreground">{f.visitor_name || "—"}</td>
                      <td className="py-2 text-foreground">{f.visitor_city || "—"}</td>
                      <td className="py-2 text-foreground">{f.visitor_company || "—"}</td>
                      <td className="py-2 text-foreground max-w-xs truncate">{f.feedback_text || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Click Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "LinkedIn", filter: (c: any) => c.element_label === "LinkedIn" },
            { label: "Email", filter: (c: any) => c.element_label === "Email" },
            { label: "Phone Reveal", filter: (c: any) => c.element_label === "Phone Reveal" },
            { label: "GitHub", filter: (c: any) => c.element_label === "GitHub" },
          ].map(({ label, filter }) => {
            const count = clicks.filter(filter).length;
            return (
              <div key={label} className="p-4 rounded-xl bg-card border border-border text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{label} clicks</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
