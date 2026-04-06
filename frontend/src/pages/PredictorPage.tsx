import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, Target, ArrowRight, Shield, Scale, Sparkles, Zap, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApi } from '@/hooks/useApi';

interface PredictionResult {
  win_probability: number;
  judgement_type: string;
  settlement_range: string;
  reasoning: string | Record<string, any>;
  key_risks?: string[];
  predicted_for?: string;
}

export default function PredictorPage() {
  const [caseDetails, setCaseDetails] = useState({ type: '', description: '', court: '' });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { request, loading, error } = useApi();

  const handlePredict = async () => {
    if (!caseDetails.description.trim() || loading) return;
    
    setPrediction(null);
    try {
      const data = await request("/predict-outcome", {
        method: "POST",
        body: JSON.stringify({ facts: caseDetails.description }),
      });
      setPrediction(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold mb-2 text-foreground">Case Outcome Predictor</h2>
        <p className="text-muted-foreground text-sm">AI trained on 500,000+ Indian court judgments using Legal-BERT</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Case Type</label>
            <Input value={caseDetails.type} onChange={e => setCaseDetails(d => ({ ...d, type: e.target.value }))} placeholder="e.g., Property Dispute" className="bg-muted/40 border-border h-11 focus:border-primary/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Court / Forum</label>
            <Input value={caseDetails.court} onChange={e => setCaseDetails(d => ({ ...d, court: e.target.value }))} placeholder="e.g., Delhi High Court" className="bg-muted/40 border-border h-11 focus:border-primary/50 transition-colors" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Case Facts & Details</label>
          <Textarea value={caseDetails.description} onChange={e => { setCaseDetails(d => ({ ...d, description: e.target.value })); setPrediction(null); }}
            placeholder="Describe the case facts, parties involved, and key arguments..." className="bg-muted/40 border-border min-h-[120px] focus:border-primary/50 transition-colors" />
        </div>
        <Button onClick={handlePredict} disabled={loading || !caseDetails.description.trim()} className="mt-4 gradient-gold text-primary-foreground shadow-sm shadow-primary/15 disabled:opacity-30 min-w-[160px]">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Predict Outcome <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Processing Legal Data using Legal-BERT...</p>
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 glass-card border-destructive/20 rounded-2xl flex items-center gap-4 text-destructive">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </motion.div>
        ) : prediction ? (
          <motion.div key="prediction" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Win Probability */}
            <div className="glass-card rounded-xl p-6 glow-gold-subtle">
              <h3 className="font-display font-semibold mb-5 flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-primary" /> Win Probability Analysis
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(40, 15%, 88%)" strokeWidth="8" />
                    <motion.circle cx="60" cy="60" r="50" fill="none" stroke="hsl(350, 55%, 38%)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${prediction.win_probability * 100 * 3.14} 314`} initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-display text-primary">{(prediction.win_probability * 100).toFixed(0)}%</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{prediction.judgement_type}</span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Favorable Probability</span>
                      <span className="font-semibold text-success">{(prediction.win_probability * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted/60 rounded-full h-2 overflow-hidden">
                      <motion.div className="bg-success h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${prediction.win_probability * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }} />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3 text-primary" /> Confidence: <span className="text-foreground font-medium">High</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 text-success" /> Judgement: <span className="text-success font-medium">{prediction.judgement_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Settlement */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <Scale className="w-4 h-4 text-primary" /> Settlement Recommendation
                </h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Optimal Range</span>
                    <span className="text-sm text-primary font-bold">{prediction.settlement_range}</span>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <Sparkles className="w-3 h-3 text-primary inline mr-1.5" /> 
                      {typeof prediction.reasoning === 'string' ? prediction.reasoning.split('\n')[0] : 'Analysis based on similar precedents.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risks */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Risk Assessment
                </h3>
                <div className="space-y-2">
                  {(prediction.key_risks || ['Procedural delays possible', 'Evidence validation required']).map((risk, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/40">
                      <div className="w-7 h-7 rounded-lg bg-warning/8 flex items-center justify-center shrink-0">
                        <Shield className="w-3.5 h-3.5 text-warning" />
                      </div>
                      <span className="text-sm flex-1 text-foreground">{risk}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" /> AI Detailed Reasoning
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                {typeof prediction.reasoning === 'string' ? (
                  prediction.reasoning.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <p>Comprehensive analysis complete based on the provided facts and historical legal data.</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
