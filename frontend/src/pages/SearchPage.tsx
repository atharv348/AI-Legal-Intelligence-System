import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Scale, FileText, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';

const CATEGORIES = ['All', 'Supreme Court', 'High Court', 'Acts & Laws', 'Constitution'];
const SUGGESTIONS = ['Sexual harassment workplace', 'Right to privacy', 'Bail provisions BNS 2023', 'Article 370'];

interface SearchResult {
  answer: string;
  sources: {
    id: number;
    content: string;
    metadata?: {
      title?: string;
      court?: string;
      date?: string;
    };
  }[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const { request, loading, error } = useApi();

  const handleSearch = async (text?: string) => {
    const searchQuery = text || query;
    if (!searchQuery.trim() || loading) return;
    
    setHasSearched(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append("question", searchQuery);
      
      const data = await request("/search", {
        method: "POST",
        body: formData,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const iconForType = (type: string) => {
    if (type === 'Judgment') return <Scale className="w-4 h-4 text-primary" />;
    if (type === 'Act') return <FileText className="w-4 h-4 text-accent" />;
    return <BookOpen className="w-4 h-4 text-info" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold mb-2 text-foreground">Legal Knowledge Engine</h2>
        <p className="text-muted-foreground text-sm">Search across 15M+ judgments, Acts, and Constitutional provisions</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5 glow-gold-subtle">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search judgments, laws, or articles..." className="pl-11 bg-muted/40 border-border h-12 text-base focus:border-primary/50 transition-colors" />
          </div>
          <Button onClick={() => handleSearch()} disabled={loading || !query.trim()} className="gradient-gold text-primary-foreground h-12 px-6 shadow-sm shadow-primary/15 min-w-[120px]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> Search</>}
          </Button>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeCategory === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>{cat}</button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Analyzing 15M+ legal records...</p>
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 glass-card border-destructive/20 rounded-2xl flex items-center gap-4 text-destructive">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </motion.div>
        ) : result ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-6 glass-card rounded-2xl border-primary/20 bg-primary/[0.02]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-primary w-5 h-5" />
                <h3 className="font-display font-bold text-foreground">AI Intelligence Summary</h3>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{result.answer}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Found <span className="text-primary font-semibold">{result.sources.length}</span> primary sources for your query
              </p>
              {result.sources.map((source, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-card-hover rounded-xl p-5 cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {iconForType(source.metadata?.court ? 'Judgment' : 'Act')}
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                          {source.metadata?.court ? 'Judgment' : 'Statute/Act'}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                        {source.metadata?.title || `Legal Source #${source.id}`}
                      </h3>
                      {source.metadata?.court && (
                        <p className="text-xs text-primary/70 font-mono mt-0.5">
                          {source.metadata.court} {source.metadata.date ? `• ${source.metadata.date}` : ''}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                        {source.content}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          !hasSearched && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-5">
                <Search className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground mb-6">Enter a legal query to search across judgments, laws, and articles</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => handleSearch(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 transition-all duration-200">
                    <Sparkles className="w-3 h-3 text-primary" />{s}
                  </button>
                ))}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
