"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
    <div className="flex h-full w-72 flex-col bg-[#1E293B] border-r border-slate-800 shadow-xl transition-all">
      {/* Brand Header */}
      <div className="flex h-20 items-center px-6 mb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-md overflow-hidden border border-slate-100">
            <Image
              src="/logo.jpg"
              alt="ALIS Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-tight">NYAYA AI</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Legal Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
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
                      ? "bg-[#5D5346] text-white shadow-sm border border-slate-700" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            Preferences
          </p>
          <nav className="space-y-1.5">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive 
                      ? "bg-[#5D5346] text-white shadow-sm border border-slate-700" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white" />}
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="w-full group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
