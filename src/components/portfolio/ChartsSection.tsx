import { motion } from "framer-motion";
import { careerTimeline, certifications } from "@/data/portfolio";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

const NEON_COLORS = [
  "hsl(175, 80%, 50%)",  // cyan
  "hsl(280, 80%, 60%)",  // purple
  "hsl(45, 95%, 55%)",   // gold
  "hsl(340, 80%, 55%)",  // pink
  "hsl(140, 70%, 45%)",  // green
];

const certGroups = certifications.reduce((acc, cert) => {
  acc[cert.category] = (acc[cert.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const certChartData = Object.entries(certGroups).map(([name, value]) => ({ name, value }));

const skillRadarData = [
  { skill: "RPA", value: 95 },
  { skill: "Operations", value: 90 },
  { skill: "SAP", value: 85 },
  { skill: "AI/GenAI", value: 80 },
  { skill: "Leadership", value: 92 },
  { skill: "Six Sigma", value: 88 },
  { skill: "Power BI", value: 82 },
  { skill: "Change Mgmt", value: 85 },
];

const impactData = [
  { metric: "Cycle-Time Reduction", before: 100, after: 0.2 },
  { metric: "Customer Satisfaction", before: 85, after: 97 },
  { metric: "Inventory Accuracy", before: 85, after: 98 },
  { metric: "Manual Effort", before: 100, after: 60 },
];

const ChartsSection = () => {
  return (
    <section id="analytics" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2">Analytics</h2>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-10">Growth & Impact at a Glance</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Career Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">📈 Career Progression</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={careerTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis dataKey="year" stroke="hsl(215, 12%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(215, 12%, 55%)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 18%, 8%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "hsl(175, 80%, 50%)" }}
                />
                <Line type="monotone" dataKey="level" stroke="hsl(175, 80%, 50%)" strokeWidth={2} dot={{ fill: "hsl(175, 80%, 50%)", r: 4 }} name="Role Level" />
                <Line type="monotone" dataKey="skills" stroke="hsl(280, 80%, 60%)" strokeWidth={2} dot={{ fill: "hsl(280, 80%, 60%)", r: 4 }} name="Skills Count" />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Certifications Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">🎓 Certifications by Category ({certifications.length} total)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={certChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={{ stroke: "hsl(215, 12%, 55%)" }}
                >
                  {certChartData.map((_, i) => (
                    <Cell key={i} fill={NEON_COLORS[i % NEON_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(220, 18%, 8%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skills Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">🎯 Skill Proficiency</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="hsl(220, 14%, 16%)" />
                <PolarAngleAxis dataKey="skill" stroke="hsl(215, 12%, 55%)" fontSize={10} />
                <PolarRadiusAxis stroke="hsl(220, 14%, 16%)" fontSize={9} />
                <Radar dataKey="value" stroke="hsl(175, 80%, 50%)" fill="hsl(175, 80%, 50%)" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 18%, 8%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px", fontSize: "12px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">⚡ Key Impact Metrics (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={impactData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis type="number" stroke="hsl(215, 12%, 55%)" fontSize={11} />
                <YAxis dataKey="metric" type="category" stroke="hsl(215, 12%, 55%)" fontSize={10} width={120} />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 18%, 8%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="before" fill="hsl(340, 80%, 55%)" name="Before" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="after" fill="hsl(175, 80%, 50%)" name="After" radius={[0, 4, 4, 0]} barSize={12} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;
