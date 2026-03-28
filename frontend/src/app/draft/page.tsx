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
          <form onSubmit={handleDraft} className="flex flex-col gap-6 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex flex-col gap-2">
              <label htmlFor="docType" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Document Type</label>
              <select
                id="docType"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              >
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="language" className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                <Languages size={16} /> Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Situation Description</label>
              <textarea
                id="description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the situation, names, addresses, and key facts to include..."
                className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none resize-none"
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
          {draft ? (
            <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b dark:border-zinc-800">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Generated Draft</h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto font-serif text-gray-800 dark:text-zinc-300 leading-loose whitespace-pre-wrap">
                {draft}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-zinc-900/50 border border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl text-center text-gray-500 dark:text-zinc-500">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>Fill out the form to generate your legal document draft.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
