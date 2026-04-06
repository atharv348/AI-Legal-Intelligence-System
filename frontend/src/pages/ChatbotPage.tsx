import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Upload, Bot, User, Sparkles, Loader2, AlertCircle, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/useApi';

type Language = 'en' | 'hi' | 'mr' | 'ta';
const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'EN' },
  { value: 'hi', label: 'हिन्दी', flag: 'HI' },
  { value: 'mr', label: 'مراठी', flag: 'MR' },
  { value: 'ta', label: 'தமிழ்', flag: 'TA' },
];

interface Message { id: string; role: 'user' | 'assistant'; content: string; }

const QUICK_PROMPTS = ['How do I file an FIR?', 'What are my tenant rights?', 'Explain RTI process', 'Consumer complaint process'];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '🏛️ **Namaste!** I am your Nyaya Citizen Assistant.\n\nI can help you with:\n• Understanding your legal rights\n• Filing complaints (FIR, RTI)\n• Analyzing legal documents\n• Finding relevant laws & judgments\n\nHow can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [file, setFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { request, loading, error } = useApi();
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = lang === 'en' ? 'en-US' : (lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'ta-IN'));
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if ((!msg.trim() && !file) || loading) return;

    const userMessage = msg || (file ? `Analyze this document: ${file.name}` : "");
    const currentFile = file;
    
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: userMessage }]);
    setInput('');
    setFile(null);

    try {
      const formData = new FormData();
      formData.append("question", userMessage);
      formData.append("language", lang);
      if (currentFile) {
        formData.append("file", currentFile);
      }

      const data = await request("/chatbot", {
        method: "POST",
        body: formData,
      });

      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: data.response }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: crypto.randomUUID(), 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to the legal database right now. Please try again in a moment." 
      }]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 glass-card rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Nyaya Assistant</p>
            <p className="text-[10px] text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success inline-block" /> Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          {LANGUAGES.map(l => (
            <button key={l.value} onClick={() => setLang(l.value)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-200 ${
                lang === l.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>{l.flag}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-primary/15">
                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'gradient-gold text-primary-foreground rounded-br-sm shadow-md shadow-primary/10'
                : 'glass-card rounded-bl-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center shrink-0 mt-1 shadow-sm shadow-primary/15">
                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {QUICK_PROMPTS.map(prompt => (
            <button key={prompt} onClick={() => handleSend(prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 transition-all duration-200">
              <Sparkles className="w-3 h-3 text-primary" />{prompt}
            </button>
          ))}
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="flex items-center gap-2 mb-2 px-4 py-2 bg-muted/50 rounded-lg border border-border/50 animate-in slide-in-from-bottom-2">
          <Upload className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
          <button onClick={() => setFile(null)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
            <span className="text-xs font-bold">×</span>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 glass-card rounded-xl p-2 relative">
        <label className="shrink-0 text-muted-foreground hover:text-primary h-10 w-10 flex items-center justify-center cursor-pointer transition-colors rounded-lg hover:bg-muted">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <Upload className="w-4 h-4" />
        </label>
        <Button variant="ghost" size="icon" onClick={toggleListening}
          className={`shrink-0 h-10 w-10 rounded-lg transition-all duration-200 ${
            isListening ? 'bg-destructive/10 text-destructive animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-muted'
          }`}>
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your legal rights..." className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10" />
        <Button onClick={() => handleSend()} disabled={loading || (!input.trim() && !file)} size="icon" className="h-10 w-10 gradient-gold shrink-0 shadow-sm shadow-primary/15 disabled:opacity-30">
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" /> : <Send className="w-4 h-4 text-primary-foreground" />}
        </Button>
      </div>
    </div>
  );
}
