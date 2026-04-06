import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Languages, ArrowRight, CheckCircle, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApi } from '@/hooks/useApi';

const DOC_TYPES = [
  { id: 'FIR', label: 'FIR', icon: '🚔', desc: 'First Information Report' },
  { id: 'RTI', label: 'RTI Application', icon: '📋', desc: 'Right to Information' },
  { id: 'Bail Application', label: 'Bail Application', icon: '⚖️', desc: 'Bail request to court' },
  { id: 'Legal Notice', label: 'Legal Notice', icon: '📜', desc: 'Formal legal notice' },
  { id: 'Consumer Complaint', label: 'Consumer Complaint', icon: '🛡️', desc: 'Consumer forum complaint' },
  { id: 'Affidavit', label: 'Affidavit', icon: '📝', desc: 'Sworn statement' },
];

const LANGS = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'Hindi' },
  { id: 'mr', name: 'Marathi' },
  { id: 'ta', name: 'Tamil' },
  { id: 'te', name: 'Telugu' },
  { id: 'kn', name: 'Kannada' }
];

export default function DrafterPage() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [description, setDescription] = useState('');
  const [draft, setDraft] = useState<string | null>(null);
  const { request, loading, error } = useApi();

  const handleGenerate = async () => {
    if (!selectedDoc || !description.trim() || loading) return;
    
    setDraft(null);
    try {
      const data = await request("/draft-document", {
        method: "POST",
        body: JSON.stringify({ 
          description, 
          doc_type: selectedDoc, 
          language: selectedLang 
        }),
      });
      setDraft(data.draft);
    } catch (err) {
      console.error(err);
    }
  };

  const Step = ({ num, children }: { num: number; children: React.ReactNode }) => (
    <div className="flex items-center gap-2.5 text-sm font-semibold text-primary mb-3">
      <span className="w-6 h-6 rounded-full gradient-gold text-primary-foreground text-xs flex items-center justify-center font-bold shadow-sm shadow-primary/15">{num}</span>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold mb-2 text-foreground">Multilingual Document Drafter</h2>
        <p className="text-muted-foreground text-sm">Generate ready-to-file legal documents in 6 Indian languages</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-xl p-5">
        <Step num={1}>Select Document Type</Step>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {DOC_TYPES.map(doc => (
            <button key={doc.id} onClick={() => { setSelectedDoc(doc.id); setDraft(null); }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                selectedDoc === doc.id ? 'border-primary bg-primary/8 shadow-sm' : 'border-border bg-muted/30 hover:border-primary/30 hover:bg-muted/60'
              }`}>
              <span className="text-xl">{doc.icon}</span>
              <div><p className="text-sm font-medium text-foreground">{doc.label}</p><p className="text-[10px] text-muted-foreground">{doc.desc}</p></div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
        <Step num={2}><Languages className="w-4 h-4" /> Choose Language</Step>
        <div className="flex gap-2 flex-wrap">
          {LANGS.map(l => (
            <button key={l.id} onClick={() => setSelectedLang(l.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedLang === l.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>{l.name}</button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-xl p-5">
        <Step num={3}>Describe Your Situation</Step>
        <Textarea value={description} onChange={e => { setDescription(e.target.value); setDraft(null); }}
          placeholder="Describe the facts and circumstances in detail..."
          className="bg-muted/40 border-border min-h-[120px] focus:border-primary/50 transition-colors" />
        <Button onClick={handleGenerate} disabled={loading || !selectedDoc || !description.trim()} className="mt-3 gradient-gold text-primary-foreground shadow-sm shadow-primary/15 disabled:opacity-30 min-w-[180px]">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Document <ArrowRight className="w-4 h-4 ml-1" /></>}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Drafting your professional legal document...</p>
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 glass-card border-destructive/20 rounded-2xl flex items-center gap-4 text-destructive">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </motion.div>
        ) : draft ? (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-xl p-5 glow-gold-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold flex items-center gap-2 text-foreground">
                <CheckCircle className="w-5 h-5 text-success" /> Document Generated
              </h3>
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/8">
                <Download className="w-4 h-4 mr-1" /> Download PDF
              </Button>
            </div>
            <div className="bg-muted/40 rounded-xl p-8 font-serif text-sm leading-relaxed border border-border/50 whitespace-pre-wrap text-foreground shadow-inner max-h-[600px] overflow-y-auto">
              {draft}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
