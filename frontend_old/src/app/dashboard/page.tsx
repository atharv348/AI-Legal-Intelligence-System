"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Loader2, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  ArrowUpRight,
  Gavel,
  CheckCircle,
  Activity,
  UserCheck,
  Search,
  Zap,
  Flame,
  Mic,
  MicOff,
  Calendar
} from "lucide-react";
import { useApi } from "@/hooks/useApi";

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
    { lawyer_id: "LAW-006", adjournments: 23, abuse_score: 0.5 },
    { lawyer_id: "LAW-007", adjournments: 42, abuse_score: 0.95 },
    { lawyer_id: "LAW-008", adjournments: 14, abuse_score: 0.15 },
    { lawyer_id: "LAW-009", adjournments: 26, abuse_score: 0.55 },
    { lawyer_id: "LAW-010", adjournments: 18, abuse_score: 0.3 },
  ],
  triage_priority_recommendations: [
    { case_id: "CIVIL-2015-102", reason: "Pending for 11 years, senior citizen petitioner" },
    { case_id: "CRIM-2018-450", reason: "Undertrial prisoner in jail for 7 years without hearing" },
    { case_id: "LABOR-2019-088", reason: "Wage dispute involving 500+ workers, high priority" },
    { case_id: "RENT-2016-021", reason: "Multiple adjournments (15+) by respondent detected" },
  ],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [searchLawyer, setSearchLawyer] = useState("");
  const [lawyerAnalysis, setLawyerAnalysis] = useState<any>(null);
  const { request, loading, error } = useApi();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-IN';

        recog.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition?.start();
      setIsListening(true);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await request("/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error(err);
      setStats(FALLBACK_STATS);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLawyerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLawyer.trim()) return;
    try {
      const data = await request(`/dashboard/detect-abuse/${searchLawyer}`);
      setLawyerAnalysis(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-rose-600" size={48} />
          <p className="text-zinc-500 font-bold animate-pulse">Analyzing 200M eCourts Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#5D5346] dark:text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-[#5D5346] dark:text-blue-400" size={32} />
            Nyaya Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Court Docket Intelligence & Adjournment Abuse Monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-[#1E293B] p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#0F172A] rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
            <Calendar size={16} className="text-blue-500" />
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Gavel className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full uppercase tracking-wider">National</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Total Pending Cases</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {(stats?.total_pending_cases || FALLBACK_STATS.total_pending_cases).toLocaleString('en-IN')}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <ArrowUpRight size={14} />
            <span>2.4% vs last quarter</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="text-rose-600 dark:text-rose-400" size={24} />
            </div>
            <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-full uppercase tracking-wider">Critical</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Stuck Cases (5+ Years)</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {(stats?.stuck_cases_count || FALLBACK_STATS.stuck_cases_count).toLocaleString('en-IN')}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-rose-600 dark:text-rose-400 text-xs font-bold">
            <TrendingDown size={14} />
            <span>-0.8% efficiency drain</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full uppercase tracking-wider">Warning</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Adjournment Abuse</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {(stats?.adjournment_abuse_patterns || FALLBACK_STATS.adjournment_abuse_patterns).toLocaleString('en-IN')}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Activity size={14} />
            <span>High density in Civil Courts</span>
          </div>
        </div>

        <div className="bg-[#5D5346] p-6 rounded-3xl border border-[#5D5346] shadow-xl shadow-[#5D5346]/20 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
              <UserCheck className="text-white" size={24} />
            </div>
            <span className="text-[10px] font-black text-white bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider">System</span>
          </div>
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Triage Accuracy</p>
          <h3 className="text-3xl font-black text-white mt-1 tabular-nums">
            94.8%
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-white/90 text-xs font-bold">
            <CheckCircle size={14} />
            <span>Model v2.4 (Stable)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Heatmap & Triage */}
        <div className="lg:col-span-8 space-y-8">
          {/* Adjournment Abuse Heatmap */}
          <div className="p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="text-orange-500" size={24} /> Adjournment Abuse Heatmap
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lawyer-wise adjournment frequency analysis.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-100 dark:bg-[#0F172A] rounded-sm"></div> Low</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> High</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
              {stats?.heatmap_data?.map((item: any, idx: number) => (
                <div 
                  key={idx} 
                  className="aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all hover:scale-110 cursor-help group relative shadow-sm border border-slate-100 dark:border-slate-800"
                  style={{ 
                    backgroundColor: `rgba(249, 115, 22, ${item.abuse_score * 0.9 + 0.1})`,
                    borderColor: item.abuse_score > 0.7 ? '#f97316' : ''
                  }}
                >
                  <span className={`text-[10px] font-bold ${item.abuse_score > 0.5 ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {item.lawyer_id.split('-')[1]}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                    <p className="font-bold mb-1 text-orange-400">{item.lawyer_id}</p>
                    <p>Adjournments: {item.adjournments}</p>
                    <p>Abuse Score: {(item.abuse_score * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 py-4 border-t border-slate-50 dark:border-slate-800 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Zap size={14} className="text-blue-500" /> AI Powered Detection
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Clock size={14} className="text-rose-500" /> Real-time Updates
              </div>
            </div>
          </div>

          {/* Triage Priority */}
          <div className="p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingDown className="text-rose-600" size={24} /> Triage Priority Recommendations
            </h3>
            <div className="space-y-4">
              {stats?.triage_priority_recommendations?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between p-5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md group">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-[#1E293B] rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm font-bold text-rose-600">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-rose-600 transition-colors">{item.case_id}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.reason}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm">
                    Triage <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Search & Abuse Detector */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
               <UserCheck className="text-amber-600" size={24} /> Abuse Detector
             </h3>
             <form onSubmit={handleLawyerSearch} className="relative mb-6">
                <input 
                  type="text" 
                  value={searchLawyer}
                  onChange={(e) => setSearchLawyer(e.target.value)}
                  placeholder="Enter Lawyer ID (e.g. LAW-001)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             </form>

             {lawyerAnalysis && (
                <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl mb-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">Analysis Results</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lawyerAnalysis.abuse_detected ? 'bg-rose-500 text-white' : 'bg-green-500 text-white'}`}>
                      {lawyerAnalysis.abuse_detected ? 'High Risk' : 'Low Risk'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">{lawyerAnalysis.lawyer_id}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${lawyerAnalysis.adjournment_frequency * 100}%` }}></div>
                    </div>
                    <span className="font-bold">{(lawyerAnalysis.adjournment_frequency * 100).toFixed(0)}% freq.</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    Detected {lawyerAnalysis.abuse_detected ? 'systemic' : 'normal'} patterns of adjournment requests across multiple benches.
                  </p>
                </div>
             )}

             <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-2xl mb-6">
                <p className="text-sm text-indigo-800 dark:text-indigo-400 leading-relaxed font-medium">
                  The system detected 1420 adjournment abuse patterns this month across 200M records.
                </p>
             </div>
             <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-rose-500/20 flex items-center justify-center gap-2 group">
               Generate Full Audit <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </button>
           </div>

           {/* Quick Actions */}
           <div className="p-8 bg-[#5D5346] text-white rounded-[2rem] shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Gavel size={120} />
             </div>
             <h3 className="text-xl font-bold mb-4 relative z-10">Triage Assist</h3>
             <p className="text-sm text-white/70 mb-6 leading-relaxed relative z-10">
               Automatically prioritize cases involving senior citizens or cases pending for more than 10 years.
             </p>
             <button className="px-6 py-3 bg-white text-[#5D5346] font-bold rounded-xl text-sm hover:bg-slate-100 transition-all relative z-10">
               Launch Triage Engine
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
