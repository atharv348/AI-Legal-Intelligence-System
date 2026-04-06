import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Eye, EyeOff, ArrowRight, Shield, Fingerprint, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES, UserRole } from '@/lib/auth';
import { useApi } from '@/hooks/useApi';

export default function AuthPage() {
  const navigate = useNavigate();
  const { request, loading, error: apiError } = useApi();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    dob: '',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login Logic
        const formData = new URLSearchParams();
        formData.append("username", form.email);
        formData.append("password", form.password);

        const data = await request("/login", {
          method: "POST",
          body: formData,
        });

        localStorage.setItem("alis_token", data.access_token);
        navigate('/dashboard');
      } else {
        // Registration Logic
        if (!selectedRole) {
          setError('Please select a role');
          return;
        }

        await request("/register", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            full_name: form.name,
            dob: form.dob,
            phone: form.phone,
            role: selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1),
            location: form.location
          }),
        });

        // Auto login or switch to login
        setIsLogin(true);
        setError("Account created! Please sign in.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/login-bg.jpg" alt="Background" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative px-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-lg shadow-primary/15">
              <Scale className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-gold-gradient">ALIS</h1>
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">AI Legal Intelligence System</p>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold leading-tight mb-4 text-foreground">
            Justice, powered by <span className="text-gold-gradient">intelligence.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Access 15M+ legal records, AI-powered case analysis, multilingual document drafting, and predictive insights — all in one platform.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'End-to-end encrypted & secure' },
              { icon: Fingerprint, text: 'Role-based access for 5 user types' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-md shadow-primary/15">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-gold-gradient">ALIS</h1>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">AI Legal Intelligence</p>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="glass-card rounded-2xl p-7 glow-gold-subtle">
            <div className="flex gap-1 mb-6 bg-muted/70 rounded-xl p-1">
              {['Sign In', 'Register'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => {
                    setIsLogin(i === 0);
                    setError('');
                  }}
                  className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    (i === 0 ? isLogin : !isLogin)
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {(i === 0 ? isLogin : !isLogin) && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 gradient-gold rounded-lg shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                error.includes("Account created") 
                  ? "bg-green-50/50 border-green-200 text-green-700" 
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}>
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div key="register-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Full Name</label>
                      <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter your full name" required={!isLogin} className="bg-muted/50 border-border h-11 focus:border-primary/50 transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Date of Birth</label>
                        <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} required={!isLogin} className="bg-muted/50 border-border h-11 focus:border-primary/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Phone</label>
                        <Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" required={!isLogin} className="bg-muted/50 border-border h-11 focus:border-primary/50 transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Location</label>
                      <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Mumbai, Maharashtra" required={!isLogin} className="bg-muted/50 border-border h-11 focus:border-primary/50 transition-colors" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Email</label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required className="bg-muted/50 border-border h-11 focus:border-primary/50 transition-colors" />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" required className="bg-muted/50 border-border h-11 pr-10 focus:border-primary/50 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div key="roles" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="text-xs font-medium text-muted-foreground mb-2.5 block uppercase tracking-wider">Your Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map(role => (
                        <button key={role.value} type="button" onClick={() => setSelectedRole(role.value)}
                          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-all duration-200 ${
                            selectedRole === role.value
                              ? 'border-primary bg-primary/8 text-primary shadow-sm'
                              : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-muted/60'
                          }`}>
                          <span className="text-lg">{role.icon}</span>
                          <span className="font-medium">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={loading} className="w-full gradient-gold text-primary-foreground font-semibold h-11 mt-2 shadow-md shadow-primary/15 hover:shadow-primary/25 transition-shadow">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/60 mt-6 tracking-wide">
            End-to-end encrypted • ALIS v2.0 • India
          </p>
        </motion.div>
      </div>
    </div>
  );
}
