"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Loader2, 
  Send, 
  User, 
  Bot, 
  Languages, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Paperclip,
  X,
  Image as ImageIcon
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import VoiceInput from "@/components/VoiceInput";

const languages = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi (हिन्दी)" },
  { id: "mr", name: "Marathi (मराठी)" },
  { id: "ta", name: "Tamil (தமிழ்)" },
];

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Welcome to the ALIS Rights Assistant. I am grounded in official Indian legal data to help you understand your rights. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState(languages[0].id);
  const { request, loading, error } = useApi();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !file) || loading) return;

    const userMessage = input || (file ? `Analyze this document: ${file.name}` : "");
    setInput("");
    const currentFile = file;
    setFile(null);
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const formData = new FormData();
      formData.append("question", userMessage);
      formData.append("language", language);
      if (currentFile) {
        formData.append("file", currentFile);
      }

      const data = await request("/chatbot", {
        method: "POST",
        body: formData,
      });
      setMessages(prev => [...prev, { role: "bot", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "bot", content: "I'm sorry, I'm having trouble connecting to the legal database right now. Please try again in a moment." }]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-800">
            <MessageSquare className="text-amber-600 dark:text-amber-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Citizen Rights Chatbot</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-[10px] font-bold text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800 uppercase tracking-wider">
                <ShieldCheck size={10} /> Verified Data
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 uppercase tracking-wider">
                <Sparkles size={10} /> AI Powered
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Languages size={14} /> Language
          </div>
          <div className="flex gap-1">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === lang.id 
                    ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {lang.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden shadow-inner relative">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent pointer-events-none" />

        <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 scroll-smooth relative z-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 border border-zinc-100 dark:border-zinc-700"
                }`}>
                  {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`group relative p-5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-800"
                }`}>
                  {msg.content}
                  <div className={`absolute bottom-[-1.5rem] ${msg.role === "user" ? "right-0" : "left-0"} text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {msg.role === "user" ? "Sent" : "ALIS Assistant"}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 flex items-center justify-center animate-pulse border border-zinc-100 dark:border-zinc-700">
                  <Bot size={20} />
                </div>
                <div className="flex gap-2 p-5 bg-white dark:bg-zinc-900 rounded-3xl rounded-tl-none border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 relative z-20">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={file ? `File selected: ${file.name}` : "Ask about your rights or upload a document image..."}
                disabled={loading}
                className="w-full pl-6 pr-44 py-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-sm shadow-inner group-hover:bg-white dark:group-hover:bg-zinc-800"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <VoiceInput onTranscript={(t) => setInput(prev => prev + (prev ? " " : "") + t)} />
                <label className="p-2.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors rounded-full hover:bg-white dark:hover:bg-zinc-700">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <Paperclip size={20} />
                </label>
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !file)}
                  className="p-3.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 min-w-[48px] flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>

            {/* Selected File Preview in Chat */}
            {file && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl animate-in slide-in-from-top-1 max-w-fit">
                <div className="p-1.5 bg-white dark:bg-zinc-800 rounded-lg text-indigo-600">
                  <ImageIcon size={14} />
                </div>
                <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 truncate max-w-[150px]">
                  {file.name}
                </span>
                <button 
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full text-indigo-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </form>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
             <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> 
               Knowledge Retrieval Active
             </div>
             <a href="#" className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] hover:text-indigo-700 transition-colors">
               Connect to WhatsApp <ExternalLink size={12} />
             </a>
             <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
               v1.2 Secure
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
