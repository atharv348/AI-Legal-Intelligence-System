"use client";

import { useState } from "react";
import { Scale, Loader2, TrendingUp, AlertCircle, CheckCircle2, ShieldAlert, Coins, Lightbulb, Mic } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import VoiceInput from "@/components/VoiceInput";

export default function PredictPage() {
  const [facts, setFacts] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const { request, loading, error } = useApi();

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facts.trim()) return;
    setPrediction(null);
    try {
      const data = await request("/predict-outcome", {
        method: "POST",
        body: JSON.stringify({ facts }),
      });
      setPrediction(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl mb-4 border border-purple-100 dark:border-purple-800">
          <Scale size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Case Outcome Predictor</h1>
        <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
          Input case facts to get an AI-powered prediction of the win probability, likely judgement type, and suggested settlement range based on millions of precedents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-5">
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="facts" className="text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                  Case Facts & Situation
                </label>
                <VoiceInput onTranscript={(t) => setFacts(prev => prev + (prev ? " " : "") + t)} className="h-9 w-9" />
              </div>
              <textarea
                id="facts"
                rows={15}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                placeholder="Describe the incident, parties involved, legal sections invoked, and current status of the case..."
                className="w-full p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none resize-none text-sm leading-relaxed"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Analyzing Precedents...</span>
                </>
              ) : (
                <>
                  <Scale size={20} />
                  <span>Predict Outcome</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
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
            <div className="flex flex-col items-center justify-center flex-1 p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center">
              <Loader2 size={48} className="animate-spin text-purple-500 mb-6" />
              <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Processing Legal Data</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Using Legal-BERT to compare facts against 500,000 judgements...</p>
            </div>
          ) : prediction ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Win Probability */}
                <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
                  <p className="text-[10px] text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-[0.2em] font-bold">
                    Win Probability for {prediction.predicted_for || "User"}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      {(prediction.win_probability * 100).toFixed(0)}%
                    </div>
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000" 
                        style={{ width: `${prediction.win_probability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Judgement Type */}
                <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
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
              <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
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
                <p className="text-purple-900/80 dark:text-purple-300 text-sm leading-relaxed mb-6">
                  {prediction.reasoning}
                </p>
                
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
            <div className="flex flex-col items-center justify-center flex-1 p-12 bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-[2.5rem] text-center text-gray-500 dark:text-zinc-500">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center mb-6 shadow-sm">
                <Scale size={40} className="opacity-20" />
              </div>
              <h4 className="text-lg font-bold mb-2">Ready for Analysis</h4>
              <p className="max-w-xs mx-auto text-sm leading-relaxed">
                Provide the specific facts of your case on the left to generate a predictive outcome report.
              </p>
            </div>
          )}
        </div>
      </div>

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
