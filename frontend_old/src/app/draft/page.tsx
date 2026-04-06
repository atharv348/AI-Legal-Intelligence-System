"use client";

import { useState } from "react";
import { FileText, Loader2, Languages, Copy, Check, Download } from "lucide-react";
import { useApi } from "@/hooks/useApi";

const documentTypes = [
  { id: "FIR", name: "First Information Report (FIR)" },
  { id: "RTI", name: "RTI Application" },
  { id: "Bail Application", name: "Bail Application" },
  { id: "Consumer Complaint", name: "Consumer Complaint" },
  { id: "Legal Notice", name: "Legal Notice" },
  { id: "Affidavit", name: "Affidavit" },
];

const languages = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi (हिन्दी)" },
  { id: "mr", name: "Marathi (मराठी)" },
  { id: "ta", name: "Tamil (தமிழ்)" },
  { id: "bn", name: "Bengali (বাংলা)" },
];

export default function DraftPage() {
  const [description, setDescription] = useState("");
  const [docType, setDocType] = useState(documentTypes[0].id);
  const [language, setLanguage] = useState(languages[0].id);
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { request, loading, error } = useApi();

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      const data = await request("/draft-document", {
        method: "POST",
        body: JSON.stringify({ description, doc_type: docType, language }),
      });
      setDraft(data.draft);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    if (draft) {
      navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <FileText className="text-green-600" /> Multilingual Legal Doc Drafter
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">Generate ready-to-file legal documents in multiple Indian languages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <form onSubmit={handleDraft} className="flex flex-col gap-6 p-6 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-col gap-2">
              <label htmlFor="docType" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Document Type</label>
              <select
                id="docType"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-slate-900 dark:text-white"
              >
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="language" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Languages size={16} /> Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-slate-900 dark:text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Situation Description</label>
              <textarea
                id="description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the situation, names, addresses, and key facts to include..."
                className="w-full p-4 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none resize-none text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Draft Document"}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              {error}
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col min-h-[500px]">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#1E293B]/50 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse">
              <Loader2 className="animate-spin text-green-600 mb-4" size={40} />
              <p className="text-slate-600 dark:text-slate-400 font-bold">Drafting your document...</p>
            </div>
          ) : draft ? (
            <div className="flex-1 flex flex-col bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="text-green-600" size={18} /> Document Draft
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-[#0F172A] rounded-xl text-slate-500 transition-all flex items-center gap-2 text-sm font-bold"
                  >
                    {copied ? <><Check size={16} className="text-green-600" /> Copied</> : <><Copy size={16} /> Copy</>}
                  </button>
                  <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 text-sm font-bold">
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap font-serif leading-relaxed text-slate-800 dark:text-slate-200">
                  {draft}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#1E293B]/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-400 text-center p-12">
              <div className="w-20 h-20 bg-white dark:bg-[#1E293B] rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
                <FileText className="text-slate-300 dark:text-slate-600" size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">Ready to Draft</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[280px]">Fill out the details on the left to generate your professional legal document.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
