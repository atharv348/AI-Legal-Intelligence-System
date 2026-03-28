"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, ShieldCheck, Gavel, Calendar, Edit2, Phone, Globe } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const { request, loading: fetchLoading } = useApi();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("alis_token");
    if (!token) return;

    try {
      setError(null);
      const data = await request("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setEditData(data);
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      setError(err.message || "Failed to load profile. Please ensure the backend is running.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("alis_token");
    try {
      const data = await request("/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      setUser(data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (fetchLoading && !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 font-bold max-w-md text-center">
          {error}
        </div>
        <button 
          onClick={fetchUser}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account information and preferences</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isEditing 
              ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
          }`}
        >
          {isEditing ? "Cancel" : <><Edit2 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-[#1E293B] shadow-md">
                <User size={64} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.full_name || "Legal Professional"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{user?.email}</p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">{user?.role}</p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Verified Member
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Gavel size={24} />
              <h3 className="font-bold">System Role: {user?.role}</h3>
            </div>
            <p className="text-sm text-blue-100 opacity-90 leading-relaxed">
              You are registered as a <strong>{user?.role}</strong>. Your account is verified to access ALIS Core Modules.
            </p>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.full_name} 
                      onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-blue-500/30 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                      <User size={18} className="text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-medium">{user?.full_name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 opacity-70 cursor-not-allowed">
                    <Mail size={18} className="text-slate-400" />
                    <span className="text-slate-900 dark:text-white font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={editData.dob} 
                      onChange={(e) => setEditData({...editData, dob: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-blue-500/30 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Calendar size={18} className="text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-medium">{user?.dob}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={editData.phone} 
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-blue-500/30 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Phone size={18} className="text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-medium">{user?.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.location} 
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-blue-500/30 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Globe size={18} className="text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-medium">{user?.location}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Role / Definition</label>
                  {isEditing ? (
                    <select 
                      value={editData.role} 
                      onChange={(e) => setEditData({...editData, role: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-blue-500/30 focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all appearance-none"
                    >
                      <option value="Lawyer">Lawyer</option>
                      <option value="Citizen">Citizen</option>
                      <option value="Student">Law Student</option>
                      <option value="Police">Police Officer</option>
                      <option value="Judge">Judge / Judicial Officer</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                      <Shield size={18} className="text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-medium">{user?.role}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
