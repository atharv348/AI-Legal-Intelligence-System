"use client";

import { useState } from "react";
import { Scale, Loader2, TrendingUp, AlertCircle, CheckCircle2, ShieldAlert, Coins, Lightbulb, Mic, Paperclip, X, Image as ImageIcon } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import VoiceInput from "@/components/VoiceInput";

export default function PredictPage() {
  const [facts, setFacts] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const { request, loading, error } = useApi();

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facts.trim() && !file) return;
    setPrediction(null);
    try {
      const formData = new FormData();
      formData.append("facts", facts);
      if (file) {
        formData.append("file", file);
      }

      const data = await request("/predict-outcome", {
        method: "POST",
        body: formData,
      });
      setPrediction(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="shrink-0 mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl mb-4 border border-purple-100 dark:border-purple-800">
          <Scale size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Case Outcome Predictor</h1>
        <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto text-sm">
          AI-powered prediction of win probability, likely judgement type, and suggested settlement range.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6 min-h-0">
        {/* Prediction Analysis (Above) */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2">
          {/* ... existing prediction analysis content ... */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={24} /> Prediction Analysis
            </h3>
            {prediction && (
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100 dark:border-green-800">
                Analysis Complete
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-slate-50 dark:bg-[#1E293B]/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center">
              <Loader2 size={48} className="animate-spin text-purple-500 mb-6" />
              <h4 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Processing Legal Data</h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">Using Legal-BERT to compare facts against 500,000 judgements...</p>
            </div>
          ) : prediction ? (
            <div className="space-y-6 animate-in fade-in duration-500 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Win Probability */}
                <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                  <p className="text-[10px] text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-[0.2em] font-bold">
                    Win Probability for {prediction.predicted_for || "User"}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      {(prediction.win_probability * 100).toFixed(0)}%
                    </div>
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000" 
                        style={{ width: `${prediction.win_probability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Judgement Type */}
                <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                  <p className="text-[10px] text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-[0.2em] font-bold">Judgement Type</p>
                  <div className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                    {prediction.judgement_type === "Favourable" ? (
                      <CheckCircle2 className="text-green-500" size={28} />
                    ) : prediction.judgement_type === "Unfavourable" ? (
                      <AlertCircle className="text-rose-500" size={28} />
                    ) : (
                      <ShieldAlert className="text-amber-500" size={28} />
                    )}
                    {prediction.judgement_type}
                  </div>
                </div>
              </div>

              {/* Settlement Range */}
              <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="text-amber-500" size={18} />
                  <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold">Suggested Settlement Range</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{prediction.settlement_range}</p>
              </div>

              {/* AI Reasoning */}
              <div className="p-8 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-[2rem]">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold mb-4">
                  <Lightbulb size={20} /> AI Reasoning & Analysis
                </div>
                <div className="text-purple-900/80 dark:text-purple-300 text-sm leading-relaxed mb-6 space-y-4">
                  {typeof prediction.reasoning === 'string' ? (
                    prediction.reasoning.split('\n\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    Object.entries(prediction.reasoning).map(([key, value]: [string, any], i: number) => (
                      <div key={i}>
                        <p className="font-bold uppercase text-[10px] tracking-widest mb-1 text-purple-600/70 dark:text-purple-400/70">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p>{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                      </div>
                    ))
                  )}
                </div>
                
                {prediction.key_risks && prediction.key_risks.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest mb-3">Key Legal Risks</p>
                    <ul className="space-y-2">
                      {prediction.key_risks.map((risk: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-purple-800/70 dark:text-purple-400/70">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-slate-50 dark:bg-[#1E293B]/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center opacity-60">
              <div className="w-20 h-20 bg-white dark:bg-[#1E293B] rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
                <Scale className="text-slate-300 dark:text-slate-600" size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">Ready for Analysis</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[280px]">Provide the specific facts of your case below to generate a predictive outcome report.</p>
            </div>
          )}
        </div>

        {/* Case Facts Input (Bottom) */}
        <div className="shrink-0 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-xl relative z-10">
          <form onSubmit={handlePredict} className="relative max-w-4xl mx-auto group">
            {/* Selected File Preview */}
            {file && (
              <div className="absolute bottom-full mb-4 left-0 right-0 flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl animate-in slide-in-from-bottom-2">
                <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-purple-600">
                  <ImageIcon size={16} />
                </div>
                <div className="flex-1 min-w-0 text-xs font-bold text-purple-900 dark:text-purple-300 truncate">
                  {file.name}
                </div>
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full text-purple-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="relative">
              <textarea
                id="facts"
                rows={2}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                placeholder="Describe the incident, parties involved, and legal sections invoked..."
                className="w-full pl-6 pr-44 py-5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-[2rem] outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-base resize-none text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium shadow-inner group-hover:bg-white dark:group-hover:bg-[#0F172A]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <VoiceInput onTranscript={(t) => setFacts(prev => prev + (prev ? " " : "") + t)} />
                <label className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                  <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                  <Paperclip size={20} />
                </label>
                <button
                  type="submit"
                  disabled={loading || (!facts.trim() && !file)}
                  className="p-3.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20 active:scale-95 min-w-[48px] flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Scale size={20} />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-8 border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, trend, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-0.5 ${
          trend === 'up' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'text-green-600 bg-green-50 dark:bg-green-900/20'
        }`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </div>
      </div>
      <p className="text-gray-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
    </div>
  );
}
