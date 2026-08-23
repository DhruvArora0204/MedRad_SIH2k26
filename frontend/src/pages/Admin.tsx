import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Database, 
  Server, 
  Settings, 
  HeartHandshake, 
  Box, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Lock, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  LogOut, 
  AlertCircle, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medishareService } from '../api/medishare';
// @ts-ignore
import ColorBends from '../components/ui/ColorBends';

const AdminSidebarLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
        isActive 
          ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
      {children}
    </Link>
  );
};

// --- ADMIN LOGIN PANEL COMPONENT ---
const AdminLogin: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Valid administrator credentials check
      const validAdmin = (adminId.trim().toLowerCase() === 'admin' || adminId.trim().toLowerCase() === 'medrad_admin') && 
                          (password === 'admin' || password === 'admin123' || password === 'medrad2026' || password === 'password');

      if (validAdmin) {
        sessionStorage.setItem('medrad_admin_auth', 'true');
        sessionStorage.setItem('medrad_admin_user', adminId.trim());
        setLoading(false);
        onLoginSuccess();
      } else {
        setLoading(false);
        setError('Invalid Admin ID or Password. Please check credentials.');
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setAdminId('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon Header */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-[1px] shadow-[0_0_25px_rgba(99,102,241,0.4)] mb-4">
            <div className="w-full h-full bg-zinc-950/90 rounded-[15px] flex items-center justify-center">
              <Lock className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            Admin Console Access
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xs">
            Enter administrative credentials to access MedRad clinical operations & control nodes.
          </p>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-medium tracking-wider">
              Admin Identifier
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input 
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-zinc-900/80 border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5 font-medium tracking-wider">
              Secret Passkey
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Key className="w-4 h-4" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900/80 border border-white/[0.1] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Console...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Shortcut Box */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] text-center relative z-10">
          <div className="text-xs text-zinc-500 mb-2.5">
            Default Credentials: <code className="text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded font-mono">admin</code> / <code className="text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded font-mono">admin123</code>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autofill Demo Credentials</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- SUB-PAGES ---

const AdminOverview = () => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-white">Operations Control Center</h2>
          <p className="text-xs text-zinc-400 mt-1">Live monitoring and cluster infrastructure overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SUPERUSER AUTHENTICATED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'RADIS AI API', value: backendOnline ? 'ONLINE' : 'CONNECTING', sub: 'FastAPI Port 8000' },
          { title: 'MEDISHARE NODE', value: 'ACTIVE', sub: 'Express Port 5000' },
          { title: 'BLOCKCHAIN NODE', value: 'LOCALHOST', sub: 'Hardhat Port 8545' },
          { title: 'GEMINI AI ENGINE', value: 'ONLINE', sub: 'v2.5 Flash Model' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/60 p-5 rounded-2xl border border-white/[0.08] backdrop-blur-md">
            <div className="text-zinc-400 text-xs font-semibold tracking-wider mb-1 font-mono uppercase">{stat.title}</div>
            <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* System Status */}
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/[0.08] backdrop-blur-md">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-cyan-400" /> System Microservices Status</h3>
          <div className="space-y-3">
            {[
              { name: 'RADIS FASTAPI ENGINE (Port 8000)', status: backendOnline === true ? 'ONLINE' : backendOnline === false ? 'OFFLINE' : 'CHECKING', color: backendOnline ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10' },
              { name: 'MONGODB REPOSITORY', status: 'CONNECTED', color: 'text-green-400 bg-green-500/10' },
              { name: 'HARDHAT SMART CONTRACT DEPLOYER', status: 'READY', color: 'text-green-400 bg-green-500/10' },
              { name: 'GEMINI AI REPORT PARSER', status: 'ACTIVE', color: 'text-green-400 bg-green-500/10' },
            ].map(sys => (
              <div key={sys.name} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-300 text-sm font-medium">{sys.name}</span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${sys.color}`}>{sys.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/[0.08] backdrop-blur-md">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-400" /> Administrative Telemetry</h3>
          <div className="space-y-4">
            {[
              { action: 'MedRad Ecosystem Unified', details: 'Connected unified frontend to AI backend & Express node', time: 'Active', icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
              { action: 'Smart Contract Batch Verification', details: 'GET /chain/api/verify/:batchNumber operational', time: 'Active', icon: <Database className="w-4 h-4 text-blue-400" /> },
              { action: 'Gemini Diagnostic Analyzer', details: 'POST /users/upload active with multipart parsing', time: 'Active', icon: <Activity className="w-4 h-4 text-purple-400" /> },
            ].map((act, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1">{act.icon}</div>
                <div>
                  <div className="text-zinc-200 text-sm font-medium">{act.action}</div>
                  <div className="text-zinc-500 text-xs">{act.details} • {act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDonations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await medishareService.getAllDonations();
      if (Array.isArray(res.data)) setDonations(res.data);
    } catch (err) {
      console.error("Admin donations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    try {
      await medishareService.updateDonationStatus(id, status, `Updated by admin to ${status}`);
      fetchDonations();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-white mb-6">Donation Management</h2>
      <div className="bg-zinc-900/60 rounded-2xl border border-white/[0.08] overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="p-8 text-center text-zinc-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> Loading donations...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">No donations submitted in database yet.</div>
        ) : (
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/40 text-xs uppercase text-zinc-500 font-mono">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Medicine</th>
                <th className="px-6 py-4 font-medium">Batch</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {donations.map((row: any) => (
                <tr key={row._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-zinc-300">{row.user?.name || row.user?.email || 'User'}</td>
                  <td className="px-6 py-4 text-white font-medium">{row.medicine} ({row.brand || 'Generic'})</td>
                  <td className="px-6 py-4 font-mono text-xs text-cyan-400">{row.batchNumber}</td>
                  <td className="px-6 py-4">{row.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      row.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      row.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {row.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {row.status !== 'approved' && row.status !== 'rejected' ? (
                      <div className="flex gap-2">
                        <button 
                          disabled={updatingId === row._id}
                          onClick={() => handleStatusUpdate(row._id, 'approved')} 
                          className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition disabled:opacity-50 border border-green-500/20"
                        >
                          Approve
                        </button>
                        <button 
                          disabled={updatingId === row._id}
                          onClick={() => handleStatusUpdate(row._id, 'rejected')} 
                          className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition disabled:opacity-50 border border-red-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', price: '', quantity: '', expirationDate: '' });
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchMeds = async () => {
    setLoading(true);
    try {
      const res = await medishareService.getMedicines();
      if (Array.isArray(res.data)) setMedicines(res.data);
    } catch (err) {
      console.error("Medicines error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMsg(null);
    try {
      await medishareService.addMedicine({
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        expirationDate: form.expirationDate
      });
      setMsg("Medicine added successfully!");
      setForm({ name: '', price: '', quantity: '', expirationDate: '' });
      fetchMeds();
    } catch (err: any) {
      console.error("Add medicine error:", err);
      setMsg(err.response?.data?.error || "Failed to add medicine (Ensure backend is running).");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-xl font-medium text-white mb-6">Medicine Inventory Management</h2>

      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/[0.08] space-y-4 backdrop-blur-md">
        <h3 className="text-base font-medium flex items-center gap-2"><Plus className="w-4 h-4 text-cyan-400" /> Register New Medicine Batch</h3>
        {msg && <div className="p-3 bg-white/10 text-xs rounded-xl border border-white/20">{msg}</div>}
        <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Medicine Name" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            className="p-3 bg-black/40 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
          />
          <input 
            type="number" 
            placeholder="Price ($)" 
            value={form.price} 
            onChange={e => setForm({...form, price: e.target.value})} 
            required 
            className="p-3 bg-black/40 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
          />
          <input 
            type="number" 
            placeholder="Stock Quantity" 
            value={form.quantity} 
            onChange={e => setForm({...form, quantity: e.target.value})} 
            required 
            className="p-3 bg-black/40 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
          />
          <input 
            type="date" 
            value={form.expirationDate} 
            onChange={e => setForm({...form, expirationDate: e.target.value})} 
            required 
            className="p-3 bg-black/40 border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
          />
          <button 
            type="submit" 
            disabled={adding}
            className="md:col-span-4 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin" />} Add Medicine Batch
          </button>
        </form>
      </div>

      <div className="bg-zinc-900/60 rounded-2xl border border-white/[0.08] overflow-hidden p-6 backdrop-blur-md">
        <h3 className="text-base font-medium mb-4">Active Medicine Inventory</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400"><Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> Loading inventory...</div>
        ) : medicines.length === 0 ? (
          <p className="text-zinc-500 text-sm">No medicines registered in database yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medicines.map((m: any) => (
              <div key={m._id} className="p-4 bg-black/40 rounded-xl border border-white/[0.06] space-y-1">
                <div className="font-bold text-white">{m.name}</div>
                <div className="text-xs text-zinc-400">Price: ${m.price} | Stock: {m.quantity}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN ADMIN ROUTER / SHELL ---

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('medrad_admin_auth') === 'true';
  });

  const handleLogout = () => {
    sessionStorage.removeItem('medrad_admin_auth');
    sessionStorage.removeItem('medrad_admin_user');
    setIsAuthenticated(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#07070a] flex text-zinc-100 font-sans relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-screen">
        <ColorBends
          colors={["#FF9FFC", "#5227FF", "#00ffd1"]}
          rotation={0}
          speed={0.04}
          scale={3}
          frequency={0.2}
          warpStrength={0.3}
          mouseInfluence={0.2}
          noise={0.1}
          parallax={0.1}
          iterations={1}
          intensity={1}
          bandWidth={10}
          transparent
        />
      </div>

      {/* LOGIN GATE: If not authenticated, render Login Panel */}
      {!isAuthenticated ? (
        <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        /* AUTHENTICATED ADMIN DASHBOARD */
        <div className="w-full flex z-10">
          {/* SIDEBAR */}
          <div className="w-64 border-r border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl p-6 hidden md:flex flex-col justify-between z-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Administrator</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Console Unlocked</span>
                </div>
              </div>

              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3 font-mono">
                Admin Controls
              </div>
              <AdminSidebarLink to="/admin" icon={Activity}>Overview</AdminSidebarLink>
              <AdminSidebarLink to="/admin/donations" icon={HeartHandshake}>Donations</AdminSidebarLink>
              <AdminSidebarLink to="/admin/medicines" icon={Box}>Medicines</AdminSidebarLink>
              <AdminSidebarLink to="/admin/blockchain" icon={Database}>Blockchain</AdminSidebarLink>
              <AdminSidebarLink to="/admin/settings" icon={Settings}>Settings</AdminSidebarLink>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Lock Console / Sign Out</span>
              </button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto z-10 relative">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/donations" element={<AdminDonations />} />
              <Route path="/medicines" element={<AdminMedicines />} />
              <Route path="/blockchain" element={<div className="text-zinc-500 text-center py-12 font-mono">Blockchain Node Live on Port 8545 (/chain/api/verify/:batchNumber)</div>} />
              <Route path="/settings" element={<div className="text-zinc-400 p-6 bg-zinc-900/60 rounded-2xl border border-white/[0.08]">Administrative system parameters & telemetry settings</div>} />
            </Routes>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
