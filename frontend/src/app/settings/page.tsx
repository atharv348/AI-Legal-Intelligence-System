"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Moon, Sun, Globe, User, Save, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);
  const { request, loading: fetchLoading, error: apiError } = useApi();
  
  // Account settings
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // Load settings and user on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("alis_dark_mode") === "true";
    const savedNotifications = localStorage.getItem("alis_notifications") !== "false";
    const savedLanguage = localStorage.getItem("alis_language") || "English";
    
    setDarkMode(savedDarkMode);
    setNotifications(savedNotifications);
    setLanguage(savedLanguage);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("alis_token");
    if (!token) return;

    try {
      const data = await request("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFullName(data.full_name || "");
      setDob(data.dob || "");
      setPhone(data.phone || "");
      setRole(data.role || "");
      setLocation(data.location || "");
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      // Don't throw here, just log. The apiError from useApi will be handled in UI
    }
  };

  const handleSave = async () => {
    if (activeTab === "General") {
      localStorage.setItem("alis_dark_mode", String(darkMode));
      localStorage.setItem("alis_notifications", String(notifications));
      localStorage.setItem("alis_language", language);
      
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (activeTab === "Account") {
      setUserLoading(true);
      const token = localStorage.getItem("alis_token");
      try {
        await request("/users/me", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: fullName,
            dob,
            phone,
            role,
            location,
          }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setUserLoading(false);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Configure your system preferences and security</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl border border-green-100 dark:border-green-800 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} />
            <span className="text-sm font-bold">Settings Saved</span>
          </div>
        )}
        {apiError && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle size={16} />
            <span className="text-sm font-bold">Connection Error</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {[
            { name: "General", icon: Settings },
            { name: "Account", icon: User },
            { name: "Security", icon: Lock },
            { name: "Notifications", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.name
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-800"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            {activeTab === "General" && (
              <>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">General Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">System Theme</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between light and dark modes</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Bell size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Notifications</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive alerts for important updates</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                        <Globe size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Default Language</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Preferred interface language</p>
                      </div>
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Account" && (
              <>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">DOB</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">What defines you?</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      <option value="Lawyer">Lawyer</option>
                      <option value="Citizen">Citizen</option>
                      <option value="Student">Law Student</option>
                      <option value="Police">Police Officer</option>
                      <option value="Judge">Judge / Judicial Officer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Security" && (
              <div className="text-center py-12">
                <Lock size={48} className="mx-auto text-slate-300 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white">Security Settings</h4>
                <p className="text-sm text-slate-500 mt-2">Password management and two-factor authentication are coming soon.</p>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white">Notification Preferences</h4>
                <p className="text-sm text-slate-500 mt-2">Email and Push notification customization is coming soon.</p>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={userLoading}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {userLoading ? "Saving..." : <><Save size={18} /> Save Settings</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


