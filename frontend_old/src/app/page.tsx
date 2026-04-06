import Link from "next/link";
import { 
  Search, 
  Scale, 
  FileText, 
  MessageSquare, 
  LayoutDashboard,
  ArrowRight,
  Gavel,
  Shield,
  Zap,
  Globe,
  Database,
  ChevronRight,
  Sparkles
} from "lucide-react";

const capabilities = [
  {
    title: "Nyaya Search Engine",
    description: "Search over 15 million Indian court judgements in seconds using plain English or Hindi. Powered by vector embeddings and Nyaya AI v3.0.",
    icon: Search,
    href: "/search",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Case Outcome Predictor",
    description: "Trained on 500,000 judgements using Legal-BERT + XGBoost to predict win probabilities with high accuracy.",
    icon: Scale,
    href: "/predict",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Legal Document Drafter",
    description: "Generate ready-to-file bail applications, RTI requests, or consumer complaints in multiple Indic languages.",
    icon: FileText,
    href: "/draft",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Nyaya Citizen Chatbot",
    description: "Ground-truth RAG chatbot for WhatsApp, helping citizens understand their legal rights in 10+ languages.",
    icon: MessageSquare,
    href: "/chatbot",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Court Docket Intelligence",
    description: "Dashboard for administrators to detect adjournment abuse and prioritize triage for pending cases.",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
  },
];

const stats = [
  { label: "Judgements Indexed", value: "15M+", icon: Database },
  { label: "Processing Speed", value: "< 200ms", icon: Zap },
  { label: "Indic Languages", value: "12+", icon: Globe },
  { label: "Accuracy Rate", value: "94.8%", icon: Shield },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D5346]/10 border border-[#5D5346]/20 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles size={14} className="text-[#5D5346]" />
              <span className="text-xs font-bold text-[#5D5346] uppercase tracking-[0.2em]">
                NYAYA AI — MASTER SYSTEM v3.0
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-[#1E293B] sm:text-7xl dark:text-white mb-6 leading-[1.1]">
              India's Most Trusted <br />
              <span className="text-[#5D5346]">Legal Intelligence</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Empowering citizens and legal professionals with precise, warm, and 
              authoritative legal assistance powered by advanced Indian Law models.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto px-10 py-5 bg-[#5D5346] hover:bg-[#4D4336] text-white rounded-2xl font-black transition-all shadow-xl shadow-[#5D5346]/20 flex items-center justify-center gap-2 group"
              >
                Launch Nyaya Search <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/chatbot"
                className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-[#1E293B] text-[#5D5346] dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Talk to Nyaya AI <MessageSquare size={20} />
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-slate-100 dark:border-slate-800 py-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-2 bg-slate-50 dark:bg-[#1E293B] rounded-lg">
                    <stat.icon className="text-[#5D5346] dark:text-blue-400" size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#1E293B] dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1E293B] dark:text-white tracking-tight">Core Modules</h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-lg">Five pillars of modern legal intelligence designed for the Indian judiciary.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <Link
              key={capability.title}
              href={capability.href}
              className="group relative flex flex-col p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-[2.5rem] transition-all hover:shadow-2xl hover:shadow-[#5D5346]/10 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-8 ${capability.bgColor} ${capability.color} group-hover:scale-110 transition-transform`}>
                <capability.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#1E293B] dark:text-white mb-3 tracking-tight">{capability.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow text-base leading-relaxed font-medium">{capability.description}</p>
              <div className="flex items-center text-[#5D5346] dark:text-blue-400 font-black text-sm uppercase tracking-widest">
                Access Module <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
