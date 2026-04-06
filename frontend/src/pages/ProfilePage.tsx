import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Phone, MapPin, Shield, Edit2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/useApi';
import { ROLES } from '@/lib/auth';

export default function ProfilePage() {
  const { request, loading } = useApi();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await request("/users/me");
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      const data = await request("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          full_name: formData.full_name,
          dob: formData.dob,
          phone: formData.phone,
          role: formData.role,
          location: formData.location
        }),
      });
      setProfile(data);
      setIsEditing(false);
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile' });
    }
  };

  if (!profile && loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">User Profile</h2>
          <p className="text-muted-foreground text-sm">Manage your account information and preferences</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="border-primary/30 text-primary hover:bg-primary/8">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        )}
      </motion.div>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            status.type === 'success' ? 'bg-green-50/50 border-green-200 text-green-700' : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-medium">{status.message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 text-center glow-gold-subtle">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center shadow-lg shadow-primary/20 mx-auto">
                <span className="text-3xl font-bold text-primary-foreground">
                  {profile.full_name?.charAt(0) || profile.email?.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <Shield size={14} />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">{profile.full_name}</h3>
            <p className="text-sm text-primary font-medium mt-1">{profile.role}</p>
            <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary/60" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary/60" />
                <span>{profile.location || 'Location not set'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full">
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input disabled={!isEditing} value={formData?.full_name || ''} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="pl-10 bg-muted/40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
                  <select disabled={!isEditing} value={formData?.role || ''} onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50">
                    {ROLES.map(role => (
                      <option key={role.value} value={role.label}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="date" disabled={!isEditing} value={formData?.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="pl-10 bg-muted/40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="tel" disabled={!isEditing} value={formData?.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="pl-10 bg-muted/40" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input disabled={!isEditing} value={formData?.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} className="pl-10 bg-muted/40" />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button type="submit" disabled={loading} className="gradient-gold text-primary-foreground min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                  </Button>
                  <Button type="button" onClick={() => { setIsEditing(false); setFormData(profile); }} variant="ghost" className="text-muted-foreground">
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
