import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Clock, Users, Gavel, ArrowUpRight, ArrowDownRight, Activity, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useApi } from '@/hooks/useApi';

const FALLBACK_STATS = {
  total_pending_cases: 44800000,
  stuck_cases_count: 31200000,
  adjournment_abuse_patterns: 1420,
  heatmap_data: [
    { lawyer_id: "LAW-001", adjournments: 31, abuse_score: 0.9 },
    { lawyer_id: "LAW-002", adjournments: 28, abuse_score: 0.6 },
    { lawyer_id: "LAW-003", adjournments: 16, abuse_score: 0.2 },
    { lawyer_id: "LAW-004", adjournments: 35, abuse_score: 0.8 },
    { lawyer_id: "LAW-005", adjournments: 20, abuse_score: 0.4 },
  ],
  triage_priority_recommendations: [
    { case_id: "CIVIL-2015-102", reason: "Pending for 11 years, senior citizen petitioner" },
    { case_id: "CRIM-2018-450", reason: "Undertrial prisoner in jail for 7 years without hearing" },
    { case_id: "LABOR-2019-088", reason: "Wage dispute involving 500+ workers, high priority" },
    { case_id: "RENT-2016-021", reason: "Multiple adjournments (15+) by respondent detected" },
  ],
};

const caseTypeData = [
  { name: 'Civil', value: 42, color: 'hsl(350, 55%, 38%)' },
  { name: 'Criminal', value: 28, color: 'hsl(0, 65%, 48%)' },
  { name: 'Constitutional', value: 12, color: 'hsl(210, 65%, 45%)' },
  { name: 'Tax', value: 10, color: 'hsl(152, 50%, 38%)' },
  { name: 'Other', value: 8, color: 'hsl(32, 60%, 45%)' },
];

const trendData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  filed: Math.floor(Math.random() * 200000 + 300000),
  resolved: Math.floor(Math.random() * 180000 + 280000),
}));

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const { request, loading } = useApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await request("/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats, using fallback", err);
        setStats(FALLBACK_STATS);
      }
    };
    fetchStats();
  }, [request]);

  if (loading && !stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Analyzing 200M eCourts Records...</p>
      </div>
    );
  }

  const currentStats = stats || FALLBACK_STATS;

  const metrics = [
    { label: 'Pending Cases', value: (currentStats.total_pending_cases / 1000000).toFixed(1) + 'M', change: '+2.3%', up: true, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Stuck Cases (5+ yrs)', value: (currentStats.stuck_cases_count / 1000000).toFixed(1) + 'M', change: '+0.8%', up: true, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Adjournment Abuse', value: currentStats.adjournment_abuse_patterns.toLocaleString(), change: '+12.5%', up: true, icon: Gavel, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Active Judges', value: '18,247', change: '-3.1%', up: false, icon: Users, color: 'text-info', bg: 'bg-info/10' },
  ];

  const adjournmentData = (currentStats.heatmap_data || []).map((item: any) => ({
    court: item.lawyer_id,
    rate: item.abuse_score * 100
  }));
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-7xl">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            variants={fadeUp}
            className="glass-card-hover rounded-xl p-5 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                m.up ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.change}
              </span>
            </div>
            <p className="text-2xl font-bold font-display tracking-tight">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Filing vs Resolution Trend
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded-full bg-destructive" /> Filed</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 rounded-full bg-success" /> Resolved</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradFiled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 65%, 48%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(0, 65%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152, 50%, 38%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(152, 50%, 38%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 85%)" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(220, 12%, 60%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(220, 12%, 60%)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(40, 25%, 99%)', border: '1px solid hsl(40, 15%, 85%)', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                labelStyle={{ color: 'hsl(350, 55%, 38%)', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="filed" stroke="hsl(0, 65%, 48%)" fill="url(#gradFiled)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" stroke="hsl(152, 50%, 38%)" fill="url(#gradResolved)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Case Distribution */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4 text-foreground">Case Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={caseTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3} strokeWidth={0}>
                {caseTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(40, 25%, 99%)', border: '1px solid hsl(40, 15%, 85%)', borderRadius: '10px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {caseTypeData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adjournment */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Activity className="w-4 h-4 text-warning" />
            Adjournment Abuse Index
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={adjournmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 85%)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(220, 12%, 60%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="court" stroke="hsl(220, 12%, 60%)" fontSize={11} width={100} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(40, 25%, 99%)', border: '1px solid hsl(40, 15%, 85%)', borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={18}>
                {adjournmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.rate > 65 ? 'hsl(0, 65%, 48%)' : entry.rate > 45 ? 'hsl(38, 85%, 48%)' : 'hsl(152, 50%, 38%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Triage */}
        <motion.div variants={fadeUp} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Gavel className="w-4 h-4 text-primary" />
            AI Triage — Priority Cases
          </h3>
          <div className="space-y-2.5">
            {(currentStats.triage_priority_recommendations || []).map((c: any) => (
              <div key={c.case_id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/60 hover:border-primary/20 transition-colors duration-200 group cursor-pointer">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                  c.reason.toLowerCase().includes('critical') || c.reason.toLowerCase().includes('years') ? 'bg-destructive animate-pulse-gold' : 'bg-warning'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary/80 group-hover:text-primary transition-colors">{c.case_id}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wider ${
                      c.reason.toLowerCase().includes('critical') || c.reason.toLowerCase().includes('years') ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                    }`}>{c.reason.toLowerCase().includes('critical') ? 'CRITICAL' : 'HIGH'}</span>
                  </div>
                  <p className="text-sm mt-0.5 truncate font-medium text-foreground">{c.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
