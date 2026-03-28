"use client";

import { useState } from "react";
import { 
  Search, 
  Loader2, 
  Scale, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  Book, 
  Gavel, 
  Building2, 
  FileText, 
  Zap,
  Info,
  Paperclip,
  X,
  Image as ImageIcon
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import VoiceInput from "@/components/VoiceInput";

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

const documentTaxonomy = [
  {
    id: "constitution",
    label: "Constitution",
    icon: Book,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    description: "Fundamental Rights, Directive Principles, and Amendments.",
    examples: [
      "What are the rights under Article 21?",
      "Explain Article 32: Constitutional Remedies",
      "Provisions for Emergency under Art 352",
      "Difference between Art 226 and Art 32",
      "Article 14: Right to Equality",
      "Article 44: Uniform Civil Code",
      "Basic Structure Doctrine summary"
    ]
  },
  {
    id: "statutes",
    label: "Acts & Codes",
    icon: FileText,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    description: "IPC, CrPC, BNS (2023), and Hindu Marriage Act.",
    examples: [
      "Punishment for murder in BNS vs IPC",
      "Grounds for divorce in Hindu Marriage Act",
      "Bail provisions under BNSS 2023",
      "Section 498A IPC: Cruelty to woman",
      "Section 138 Negotiable Instruments Act",
      "Cyber Law: IT Act Section 66A",
      "POCSO Act 2012 key provisions"
    ]
  },
  {
    id: "judgements",
    label: "Judgements",
    icon: Gavel,
    color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20",
    description: "SC and High Court landmark case laws (1950-2024).",
    examples: [
      "Kesavananda Bharati case summary",
      "Right to Privacy (Puttaswamy) judgement",
      "Recent SC ruling on Adjournment Abuse",
      "Vishaka v State of Rajasthan summary",
      "Shah Bano case maintenance ruling",
      "Navtej Singh Johar decriminalization",
      "Maneka Gandhi v Union of India"
    ]
  },
  {
    id: "schemes",
    label: "Govt Schemes",
    icon: Building2,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    description: "Legal Aid, PMMY, and Social Welfare schemes.",
    examples: [
      "How to apply for Free Legal Aid?",
      "Eligibility for PM-Kisan scheme",
      "Benefits under PM-JAY Ayushman Bharat",
      "PM Mudra Yojana loan categories",
      "Janani Suraksha Yojana benefits",
      "Atal Pension Yojana eligibility",
      "Digital India Land Records info"
    ]
  }
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const { request, loading, error } = useApi();
  const [showSources, setShowSources] = useState(false);
  const [activeTab, setActiveTab] = useState(documentTaxonomy[0].id);

  const handleSearch = async (e: React.FormEvent | string) => {
    if (typeof e !== "string") e.preventDefault();
    
    const searchQuery = typeof e === "string" ? e : query;
    if (!searchQuery.trim() && !file) return;
    
    if (typeof e === "string") setQuery(e);
    
    setResult(null);
    setShowSources(false);
    
    try {
      const formData = new FormData();
      formData.append("question", searchQuery);
      if (file) {
        formData.append("file", file);
      }

      const data = await request("/search", {
        method: "POST",
        body: formData,
      });
      setResult(data);
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-4 border border-indigo-100 dark:border-indigo-800">
          <Search size={32} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">AI Legal Discovery</h1>
        <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
          Search across the entire Indian legal ecosystem. From 1950 precedents to the 2023 New Laws.
        </p>
      </div>

      {/* Discovery Tabs */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {documentTaxonomy.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25" 
                  : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-300">
          <div className="md:col-span-4 border-r border-zinc-200 dark:border-zinc-800 pr-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${documentTaxonomy.find(t => t.id === activeTab)?.color}`}>
               {activeTab === 'constitution' && <Book size={24} />}
               {activeTab === 'statutes' && <FileText size={24} />}
               {activeTab === 'judgements' && <Gavel size={24} />}
               {activeTab === 'schemes' && <Building2 size={24} />}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              {documentTaxonomy.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {documentTaxonomy.find(t => t.id === activeTab)?.description}
            </p>
          </div>
          <div className="md:col-span-8 flex flex-col justify-center gap-4">
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
               <Zap size={12} className="text-amber-500" /> Try Quick Search
             </p>
             <div className="flex flex-wrap gap-2">
                {documentTaxonomy.find(t => t.id === activeTab)?.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(ex)}
                    className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    "{ex}"
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative mb-16 group">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={file ? `File selected: ${file.name}` : "Search Constitution, BNS, SC Judgements..."}
            className="w-full pl-14 pr-56 py-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-lg group-hover:border-indigo-300"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-indigo-500 transition-colors" size={28} />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <VoiceInput onTranscript={(t) => setQuery(prev => prev + (prev ? " " : "") + t)} />
            <label className="p-3 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <Paperclip size={24} />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={20} /> Search AI</>}
            </button>
          </div>
        </div>

        {/* Selected File Preview */}
        {file && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl animate-in slide-in-from-top-2">
            <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-indigo-600">
              <ImageIcon size={16} />
            </div>
            <div className="flex-1 min-w-0 text-xs font-bold text-indigo-900 dark:text-indigo-300 truncate">
              {file.name}
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full text-indigo-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </form>

      {error && (
        <div className="p-6 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-2xl mb-8 border border-rose-100 dark:border-rose-900/20 flex items-center gap-3">
          <ShieldAlert size={20} />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 mb-12 animate-pulse">
          <Loader2 size={48} className="animate-spin text-indigo-500 mb-6" />
          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Legal Synthesis Active</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">Comparing your query against Statutes, Case Law, and 2023 Amendments...</p>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          {/* Answer Area */}
          <div className="p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Legal Analysis</h2>
            </div>
            <div className="prose prose-indigo dark:prose-invert max-w-none leading-relaxed text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">
              {result.answer}
            </div>
          </div>

          {/* Sources Area */}
          <div className="border-t border-zinc-50 dark:border-zinc-800">
            <button 
              onClick={() => setShowSources(!showSources)}
              className="w-full flex justify-between items-center p-8 text-left font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <BookOpen size={18} className="text-zinc-500" />
                </div>
                <span>Evidence & Sources ({result.sources.length} Verified Documents)</span>
              </div>
              <ChevronDown size={24} className={`transition-transform duration-300 ${showSources ? 'rotate-180' : ''}`} />
            </button>

            {showSources && (
              <div className="p-10 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.sources.map((source) => (
                    <div key={source.id} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                          <Book size={16} className="text-zinc-400 group-hover:text-indigo-500" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                          {source.metadata?.title || `Legal Document #${source.id}`}
                        </h3>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs mb-6 line-clamp-3 italic">
                        "{source.content.substring(0, 300)}..."
                      </p>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-t border-zinc-50 dark:border-zinc-800 pt-4">
                        <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
                          <Gavel size={12} /> {source.metadata?.court || "Supreme Court"}
                        </span>
                        <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
                          <Calendar size={12} /> {source.metadata?.date || "2024 Index"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldAlert({ size }: { size: number }) {
  return <AlertCircle size={size} />;
}

function AlertCircle({ size }: { size: number }) {
  return <Info size={size} />;
}
