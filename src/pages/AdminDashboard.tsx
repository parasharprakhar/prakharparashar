import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  LogOut, Users, MousePointerClick, Star, Briefcase,
  Download, ArrowLeft, Clock, Eye, MessageSquare, Search,
  CalendarDays, AlertTriangle, RefreshCw, X, FileJson,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SORT_STORAGE_KEY = "admin-dashboard-sort-prefs-v1";

const loadStoredSorts = (): Record<string, SortState<string>> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SORT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const persistSort = (id: string, sort: SortState<string>) => {
  if (typeof window === "undefined") return;
  try {
    const current = loadStoredSorts();
    current[id] = sort;
    window.localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
};

const getInitialSort = (id: string, fallback: SortState<string>): SortState<string> => {
  const stored = loadStoredSorts()[id];
  return stored && typeof stored.key === "string" && (stored.direction === "asc" || stored.direction === "desc")
    ? stored
    : fallback;
};

const COLORS = ["hsl(175,80%,50%)", "hsl(280,80%,60%)", "hsl(45,95%,55%)", "hsl(340,80%,55%)", "hsl(140,70%,45%)", "hsl(210,80%,55%)"];

type DetailState = {
  title: string;
  data: Record<string, unknown>;
} | null;

type SortDirection = "asc" | "desc";
type SortState<T extends string> = { key: T; direction: SortDirection };

const SortButton = ({
  active,
  direction,
  onClick,
  children,
  align = "left",
}: {
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  children: ReactNode;
  align?: "left" | "right";
}) => {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex w-full items-center gap-1 text-muted-foreground transition-colors hover:text-foreground ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      <span>{children}</span>
      <Icon className="h-3 w-3" />
    </button>
  );
};

const formatDateInput = (date: Date) => date.toISOString().split("T")[0];

const toReadableDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const matchesSearch = (row: Record<string, unknown>, term: string) => {
  if (!term.trim()) return true;
  const normalized = term.toLowerCase();
  return Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(normalized));
};

const toSortValue = (value: unknown, key: string) => {
  if (typeof value === "number") return value;
  if (key.includes("date") || key.includes("month") || key.includes("created")) {
    const timestamp = Date.parse(key.includes("month") ? `${String(value)} 1` : String(value));
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
  return String(value ?? "").toLowerCase();
};

const sortRows = <T extends Record<string, unknown>>(rows: T[], sort: SortState<string>) => {
  const direction = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const left = toSortValue(a[sort.key], sort.key);
    const right = toSortValue(b[sort.key], sort.key);
    if (left < right) return -1 * direction;
    if (left > right) return 1 * direction;
    return 0;
  });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [clicks, setClicks] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [recruiterData, setRecruiterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(formatDateInput(new Date()));
  const [tableSearch, setTableSearch] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<DetailState>(null);
  const [exportProgress, setExportProgress] = useState<string | null>(null);
  const [feedbackSort, setFeedbackSort] = useState<SortState<string>>({ key: "created_at", direction: "desc" });
  const [dailyKeywordSort, setDailyKeywordSort] = useState<SortState<string>>({ key: "date", direction: "desc" });
  const [monthlyKeywordSort, setMonthlyKeywordSort] = useState<SortState<string>>({ key: "month", direction: "desc" });

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        setError(userError.message);
        setLoading(false);
        return;
      }
      if (!user) { navigate("/admin"); return; }

      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        setError(roleError.message);
        setLoading(false);
        return;
      }
      if (!role) { navigate("/admin"); return; }

      await loadData();
    };
    checkAuth();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const [s, c, f, k, r] = await Promise.all([
        supabase.from("visitor_sessions").select("*").order("started_at", { ascending: false }).limit(1000),
        supabase.from("page_clicks").select("*").order("clicked_at", { ascending: false }).limit(2000),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(1000),
        supabase.from("search_keywords").select("*").order("searched_at", { ascending: false }).limit(2000),
        supabase.from("recruiter_usage").select("*").order("used_at", { ascending: false }).limit(1000),
      ]);

      const firstError = [s.error, c.error, f.error, k.error, r.error].find(Boolean);
      if (firstError) throw firstError;

      setSessions(s.data || []);
      setClicks(c.data || []);
      setFeedbackList(f.data || []);
      setKeywords(k.data || []);
      setRecruiterData(r.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const toggleSort = (current: SortState<string>, setSort: (sort: SortState<string>) => void, key: string) => {
    setSort({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" });
  };

  const runExport = (label: string, action: () => void) => {
    setExportProgress(`Preparing ${label}...`);
    window.setTimeout(() => {
      action();
      setExportProgress(`${label} exported`);
      window.setTimeout(() => setExportProgress(null), 2200);
    }, 80);
  };

  const isWithinDateRange = (dateValue?: string) => {
    if (!dateValue) return false;
    const date = new Date(dateValue);
    const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const to = endDate ? new Date(`${endDate}T23:59:59`) : null;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  };

  const filteredSessions = useMemo(() => sessions.filter((s) => isWithinDateRange(s.started_at)), [sessions, startDate, endDate]);
  const filteredClicks = useMemo(() => clicks.filter((c) => isWithinDateRange(c.clicked_at)), [clicks, startDate, endDate]);
  const filteredFeedback = useMemo(() => feedbackList.filter((f) => isWithinDateRange(f.created_at)), [feedbackList, startDate, endDate]);
  const filteredKeywords = useMemo(() => keywords.filter((k) => isWithinDateRange(k.searched_at)), [keywords, startDate, endDate]);
  const filteredRecruiterData = useMemo(() => recruiterData.filter((r) => isWithinDateRange(r.used_at)), [recruiterData, startDate, endDate]);

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

  const exportToJSON = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportFilteredCSVBundle = () => {
    runExport("filtered CSV bundle", () => {
      exportToCSV(filteredSessions, "filtered_visitor_sessions.csv");
      exportToCSV(filteredClicks, "filtered_page_clicks.csv");
      exportToCSV(filteredFeedback, "filtered_feedback.csv");
      exportToCSV(filteredKeywords, "filtered_search_keywords.csv");
      exportToCSV(filteredRecruiterData, "filtered_recruiter_usage.csv");
    });
  };

  const exportFilteredJSON = () => {
    runExport("filtered JSON", () => {
      exportToJSON({
        dateRange: { startDate: startDate || "all", endDate: endDate || "all" },
        sessions: filteredSessions,
        clicks: filteredClicks,
        feedback: filteredFeedback,
        keywords: filteredKeywords,
        recruiterUsage: filteredRecruiterData,
      }, "filtered_admin_analytics.json");
    });
  };

  // Derived analytics
  const totalVisits = filteredSessions.length;
  const quickBounces = filteredSessions.filter(s => (s.duration_seconds || 0) <= 50).length;
  const engagedVisits = filteredSessions.filter(s => (s.duration_seconds || 0) > 50).length;
  const profileCompletes = filteredSessions.filter(s => s.reached_bottom).length;
  const avgDuration = totalVisits ? Math.round(filteredSessions.reduce((a, s) => a + (s.duration_seconds || 0), 0) / totalVisits) : 0;

  const clicksByType = filteredClicks.reduce((acc, c) => {
    acc[c.element_type] = (acc[c.element_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const clickChartData = Object.entries(clicksByType).map(([name, value]) => ({ name, value }));

  const keywordCounts = filteredKeywords.reduce((acc, k) => {
    acc[k.keyword] = (acc[k.keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 15)
    .map(([keyword, count]) => ({ keyword, count }));

  const dailyKeywords = filteredKeywords.reduce((acc, k) => {
    const day = toReadableDate(k.searched_at);
    if (!acc[day]) acc[day] = {};
    acc[day][k.keyword] = (acc[day][k.keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);
  const dailyKeywordRows = sortRows(Object.entries(dailyKeywords)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .flatMap(([date, kws]) =>
      Object.entries(kws)
        .sort((a, b) => b[1] - a[1])
        .map(([keyword, count]) => ({ date, keyword, count }))
    )
    .filter((row) => matchesSearch(row, tableSearch)), dailyKeywordSort);

  const monthlyKeywords = filteredKeywords.reduce((acc, k) => {
    const month = new Date(k.searched_at).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!acc[month]) acc[month] = {};
    acc[month][k.keyword] = (acc[month][k.keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, number>>);
  const monthlyKeywordRows = sortRows(Object.entries(monthlyKeywords)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .flatMap(([month, kws]) =>
      Object.entries(kws)
        .sort((a, b) => b[1] - a[1])
        .map(([keyword, count]) => ({ month, keyword, count }))
    )
    .filter((row) => matchesSearch(row, tableSearch)), monthlyKeywordSort);

  const searchedFeedbackRows = sortRows(filteredFeedback.filter((row) => matchesSearch(row, tableSearch)), feedbackSort);

  const avgRating = filteredFeedback.length
    ? (filteredFeedback.reduce((a, f) => a + f.rating, 0) / filteredFeedback.length).toFixed(1)
    : "N/A";

  const dailyVisits = filteredSessions.reduce((acc, s) => {
    const day = new Date(s.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dailyChartData = Object.entries(dailyVisits).slice(-14).map(([date, visits]) => ({ date, visits }));

  const activeRangeLabel = `${startDate || "All time"} → ${endDate || "Today"}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          <p>Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Back to portfolio">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Filtered range: {activeRangeLabel}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadData} disabled={refreshing} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={exportFilteredCSVBundle} disabled={Boolean(exportProgress)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-colors disabled:opacity-60">
              <Download className="w-4 h-4" /> Export Filtered CSV
            </button>
            <button onClick={exportFilteredJSON} disabled={Boolean(exportProgress)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors disabled:opacity-60">
              <FileJson className="w-4 h-4" /> Export JSON
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {exportProgress && (
          <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary" role="status" aria-live="polite">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{exportProgress}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-semibold">Unable to load analytics</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <button onClick={loadData} className="text-primary hover:underline">Retry</button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_1fr_1.4fr_auto] md:items-end">
          <label className="space-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="space-y-2 text-xs text-muted-foreground">
            <span>End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="space-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Search tables</span>
            <input
              type="search"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search feedback, keywords, dates, counts..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </label>
          <button
            onClick={() => { setStartDate(""); setEndDate(formatDateInput(new Date())); setTableSearch(""); }}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { icon: Users, label: "Total Visits", value: totalVisits, color: "text-primary" },
            { icon: Clock, label: "Quick Bounce (≤50s)", value: quickBounces, color: "text-destructive" },
            { icon: Eye, label: "Engaged (>50s)", value: engagedVisits, color: "text-primary" },
            { icon: MousePointerClick, label: "Total Clicks", value: filteredClicks.length, color: "text-primary" },
            { icon: Star, label: "Avg Rating", value: avgRating, color: "text-primary" },
            { icon: Briefcase, label: "Recruiter Uses", value: filteredRecruiterData.length, color: "text-primary" },
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
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">📈 Visitor Trend</h3>
            {dailyChartData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No visits in this date range</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">🖱️ Clicks by Element</h3>
            {clickChartData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No clicks in this date range</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={clickChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value"
                    label={({ name, value }) => `${name} (${value})`} labelLine={{ stroke: "hsl(var(--muted-foreground))" }}>
                    {clickChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">🔍 Top Searched Keywords</h3>
            {topKeywords.length === 0 ? (
              <p className="text-xs text-muted-foreground">No searches in this date range</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topKeywords} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis dataKey="keyword" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={100} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">⏱️ Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-primary">{avgDuration}s</p>
                <p className="text-[10px] text-muted-foreground">Avg Duration</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-primary">{profileCompletes}</p>
                <p className="text-[10px] text-muted-foreground">Full Profile Views</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-primary">{filteredFeedback.length}</p>
                <p className="text-[10px] text-muted-foreground">Total Feedbacks</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-xl font-bold text-primary">{filteredKeywords.length}</p>
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
            <button onClick={() => runExport("visible feedback", () => exportToCSV(searchedFeedbackRows, "filtered_feedback_table.csv"))} disabled={Boolean(exportProgress)} className="text-xs text-primary hover:underline disabled:opacity-60">Export visible</button>
          </div>
          {searchedFeedbackRows.length === 0 ? (
            <p className="text-xs text-muted-foreground">No feedback matches the selected filters</p>
          ) : (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      <SortButton active={feedbackSort.key === "created_at"} direction={feedbackSort.direction} onClick={() => toggleSort(feedbackSort, setFeedbackSort, "created_at")}>Date</SortButton>
                    </th>
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      <SortButton active={feedbackSort.key === "rating"} direction={feedbackSort.direction} onClick={() => toggleSort(feedbackSort, setFeedbackSort, "rating")}>Rating</SortButton>
                    </th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">City</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Company</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedFeedbackRows.map((f) => (
                    <tr key={f.id} onClick={() => setSelectedDetail({ title: "Feedback Details", data: f })} className="cursor-pointer border-b border-border/50 hover:bg-muted/40">
                      <td className="py-2 text-muted-foreground">{toReadableDate(f.created_at)}</td>
                      <td className="py-2 text-primary">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</td>
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

        {/* Daily Keyword Breakdown */}
        <div className="p-5 rounded-xl bg-card border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">📅 Daily Keyword Breakdown</h3>
            <button onClick={() => runExport("visible daily keywords", () => exportToCSV(dailyKeywordRows, "filtered_daily_keywords.csv"))} disabled={Boolean(exportProgress)} className="text-xs text-primary hover:underline disabled:opacity-60">Export visible</button>
          </div>
          {dailyKeywordRows.length === 0 ? (
            <p className="text-xs text-muted-foreground">No daily keyword data matches the selected filters</p>
          ) : (
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      <SortButton active={dailyKeywordSort.key === "date"} direction={dailyKeywordSort.direction} onClick={() => toggleSort(dailyKeywordSort, setDailyKeywordSort, "date")}>Date</SortButton>
                    </th>
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      <SortButton active={dailyKeywordSort.key === "keyword"} direction={dailyKeywordSort.direction} onClick={() => toggleSort(dailyKeywordSort, setDailyKeywordSort, "keyword")}>Keyword</SortButton>
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      <SortButton active={dailyKeywordSort.key === "count"} direction={dailyKeywordSort.direction} onClick={() => toggleSort(dailyKeywordSort, setDailyKeywordSort, "count")} align="right">Count</SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyKeywordRows.map((row, i) => (
                    <tr key={`${row.date}-${row.keyword}-${i}`} onClick={() => setSelectedDetail({ title: "Daily Keyword Details", data: row })} className="cursor-pointer border-b border-border/50 hover:bg-muted/40">
                      <td className="py-2 text-muted-foreground">{row.date}</td>
                      <td className="py-2 text-foreground">{row.keyword}</td>
                      <td className="py-2 text-right font-medium text-foreground">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Monthly Keyword Breakdown */}
        <div className="p-5 rounded-xl bg-card border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">📊 Monthly Keyword Breakdown</h3>
            <button onClick={() => runExport("visible monthly keywords", () => exportToCSV(monthlyKeywordRows, "filtered_monthly_keywords.csv"))} disabled={Boolean(exportProgress)} className="text-xs text-primary hover:underline disabled:opacity-60">Export visible</button>
          </div>
          {monthlyKeywordRows.length === 0 ? (
            <p className="text-xs text-muted-foreground">No monthly keyword data matches the selected filters</p>
          ) : (
            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      <SortButton active={monthlyKeywordSort.key === "month"} direction={monthlyKeywordSort.direction} onClick={() => toggleSort(monthlyKeywordSort, setMonthlyKeywordSort, "month")}>Month</SortButton>
                    </th>
                    <th className="text-left py-2 text-muted-foreground font-medium">
                      <SortButton active={monthlyKeywordSort.key === "keyword"} direction={monthlyKeywordSort.direction} onClick={() => toggleSort(monthlyKeywordSort, setMonthlyKeywordSort, "keyword")}>Keyword</SortButton>
                    </th>
                    <th className="text-right py-2 text-muted-foreground font-medium">
                      <SortButton active={monthlyKeywordSort.key === "count"} direction={monthlyKeywordSort.direction} onClick={() => toggleSort(monthlyKeywordSort, setMonthlyKeywordSort, "count")} align="right">Count</SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyKeywordRows.map((row, i) => (
                    <tr key={`${row.month}-${row.keyword}-${i}`} onClick={() => setSelectedDetail({ title: "Monthly Keyword Details", data: row })} className="cursor-pointer border-b border-border/50 hover:bg-muted/40">
                      <td className="py-2 text-muted-foreground">{row.month}</td>
                      <td className="py-2 text-foreground">{row.keyword}</td>
                      <td className="py-2 text-right font-medium text-foreground">{row.count}</td>
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
            const rows = filteredClicks.filter(filter);
            return (
              <button key={label} onClick={() => setSelectedDetail({ title: `${label} Click Rows`, data: { count: rows.length, rows } })} className="p-4 rounded-xl bg-card border border-border text-center transition-colors hover:bg-muted/40">
                <p className="text-2xl font-bold text-foreground">{rows.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{label} clicks</p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="max-h-[82vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-base font-semibold text-foreground">{selectedDetail.title}</h2>
              <button onClick={() => setSelectedDetail(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close detail view">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[68vh] overflow-auto p-4">
              <dl className="grid gap-3 text-sm">
                {Object.entries(selectedDetail.data).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-border bg-background p-3">
                    <dt className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{key.replace(/_/g, " ")}</dt>
                    <dd className="break-words text-foreground">
                      {Array.isArray(value) || (value && typeof value === "object")
                        ? <pre className="whitespace-pre-wrap text-xs text-foreground">{JSON.stringify(value, null, 2)}</pre>
                        : String(value ?? "—")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
