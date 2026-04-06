import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, LayoutDashboard, MessageSquare, Search, FileText,
  TrendingUp, LogOut, Menu, X, ChevronRight, Sparkles, User as UserIcon
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Nyaya Analytics', icon: LayoutDashboard, badge: null },
  { path: '/chatbot', label: 'Citizen Chatbot', icon: MessageSquare, badge: 'AI' },
  { path: '/search', label: 'Legal Search', icon: Search, badge: '15M+' },
  { path: '/drafter', label: 'Doc Drafter', icon: FileText, badge: null },
  { path: '/predictor', label: 'Case Predictor', icon: TrendingUp, badge: 'ML' },
  { path: '/profile', label: 'User Profile', icon: UserIcon, badge: null },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-md shadow-primary/15">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-primary text-lg leading-none tracking-wide">ALIS</h2>
            <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground mt-0.5">Legal Intelligence</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-3 font-semibold">Platform</p>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-primary/8 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-primary' : 'group-hover:text-foreground'}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wider ${
                    active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>{item.badge}</span>
                )}
                {active && <ChevronRight className="w-3.5 h-3.5 text-primary/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1.5 rounded-xl bg-muted/40">
            <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm shadow-primary/15">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{user?.name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground capitalize flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {user?.role || 'citizen'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/8 w-full transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 gradient-radial">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60 px-4 lg:px-6 h-14 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <h1 className="font-display text-lg font-semibold text-foreground">
              {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'ALIS'}
            </h1>
            <span className="hidden sm:inline-flex text-[9px] px-2 py-0.5 rounded-full bg-success/12 text-success font-semibold tracking-wider uppercase">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              System Active
            </div>
          </div>
        </header>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
