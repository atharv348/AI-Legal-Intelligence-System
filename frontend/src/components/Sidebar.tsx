"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Scale, 
  FileText, 
  MessageSquare, 
  LayoutDashboard,
  Gavel,
  ChevronRight,
  HelpCircle,
  LogOut,
  User
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Search engine", href: "/search", icon: Search },
  { name: "Outcome Predictor", href: "/predict", icon: Scale },
  { name: "Doc Drafter", href: "/draft", icon: FileText },
  { name: "Rights Chatbot", href: "/chatbot", icon: MessageSquare },
  { name: "Admin Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const secondaryItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Help Center", href: "/help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("alis_token");
    router.push("/login");
  };

  return (
    <div className="flex h-full w-72 flex-col bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
      {/* Brand Header */}
      <div className="flex h-20 items-center px-6 mb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Gavel size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight">ALIS</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Legal Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
            Core Modules
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive 
                      ? "bg-slate-50 dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-800" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-blue-500" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
            Support
          </p>
          <nav className="space-y-1.5">
            {secondaryItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <item.icon size={20} className="text-slate-400 group-hover:text-slate-600" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
