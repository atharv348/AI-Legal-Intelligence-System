"use client";

import { useState } from "react";
import { HelpCircle, Search, MessageSquare, Book, FileText, ChevronRight, Phone, Mail, ExternalLink } from "lucide-react";

const faqItems = [
  {
    question: "How accurate is the Case Outcome Predictor?",
    answer: "Our predictor is trained on over 500,000 historical judgements and achieves a 94% accuracy rate on similar cases. However, legal outcomes can be influenced by many factors and the prediction should be used as a guide, not a definitive verdict.",
    icon: Search
  },
  {
    question: "Can I use the Doc Drafter for complex legal filings?",
    answer: "The Doc Drafter generates standard templates for bail applications, RTI requests, and consumer complaints. For highly complex legal documents, we recommend a final review by a legal professional.",
    icon: FileText
  },
  {
    question: "Is my case data secure and private?",
    answer: "Yes, ALIS uses enterprise-grade encryption for all data. Your case facts and documents are processed securely and are never shared with third parties.",
    icon: MessageSquare
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">How can we help you today?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Explore our knowledge base or reach out to our support team for specialized assistance.
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for articles, guides, or tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center hover:shadow-xl transition-all group">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Book size={28} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Knowledge Base</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Read our comprehensive legal guides and tutorials.</p>
          <button className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-1 mx-auto">
            Browse Guides <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center hover:shadow-xl transition-all group">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={28} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Community Forum</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Connect with other legal professionals on our forum.</p>
          <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1 mx-auto">
            Join Discussion <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center hover:shadow-xl transition-all group">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Phone size={28} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Contact Support</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Need personalized help? Our team is here for you.</p>
          <button className="text-slate-600 dark:text-slate-400 font-bold text-sm flex items-center gap-1 mx-auto">
            Get in Touch <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {faqItems.map((faq, index) => (
            <div key={index} className="p-6 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <faq.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-blue-600 rounded-3xl p-10 text-white shadow-xl shadow-blue-500/20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <HelpCircle size={160} />
        </div>
        <h3 className="text-2xl font-bold mb-4 relative z-10">Still have questions?</h3>
        <p className="text-blue-100 opacity-90 mb-8 max-w-xl mx-auto relative z-10 text-lg">
          If you couldn't find what you were looking for, please send us an email at 
          <span className="font-bold border-b-2 border-white/30 ml-2">support@alis.ai</span>
        </p>
        <button className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-bold shadow-lg hover:scale-[1.05] active:scale-[0.95] transition-all relative z-10 flex items-center gap-2 mx-auto">
          Open Support Ticket <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
}
