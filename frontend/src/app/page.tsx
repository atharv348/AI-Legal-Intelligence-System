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
  Database
} from "lucide-react";

const capabilities = [
  {
    title: "Semantic RAG Search",
    description: "Search over 15 million Indian court judgements in seconds using plain English or Hindi. Powered by vector embeddings.",
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
    title: "Multilingual Doc Drafter",
    description: "Generate ready-to-file bail applications, RTI requests, or consumer complaints in multiple Indic languages.",
    icon: FileText,
    href: "/draft",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Citizen Rights Chatbot",
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
  { label: "Accuracy Rate", value: "94%", icon: Shield },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Now Live: v1.0.0 Stable
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl dark:text-white mb-6">
              Empowering India's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Legal Future with AI</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500 dark:text-zinc-400 leading-relaxed">
              The AI Legal Intelligence System (ALIS) solves India's legal backlog through 
              advanced semantic retrieval, outcome prediction, and automated drafting.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Launch Search Engine <ArrowRight size={20} />
              </Link>
              <Link
                href="/chatbot"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                Try Rights Chatbot
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-gray-100 dark:border-zinc-800 py-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="text-gray-400 dark:text-zinc-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-zinc-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50/50 dark:bg-zinc-900/30 rounded-[3rem] mb-24 border border-gray-100 dark:border-zinc-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Core Capabilities</h2>
          <p className="mt-4 text-gray-500 dark:text-zinc-400">Five pillars of modern legal intelligence designed for the Indian judiciary.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <Link
              key={capability.title}
              href={capability.href}
              className="group relative flex flex-col p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl transition-all hover:ring-2 hover:ring-indigo-500 hover:border-transparent"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-6 ${capability.bgColor} ${capability.color}`}>
                <capability.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{capability.title}</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6 flex-grow text-sm leading-relaxed">{capability.description}</p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                Get Started <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
