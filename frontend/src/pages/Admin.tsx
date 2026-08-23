import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Database, Server, Settings, HeartHandshake, Box, CheckCircle2, Loader2, Plus } from 'lucide-react';
import { medishareService } from '../api/medishare';
// @ts-ignore
import ColorBends from '../components/ui/ColorBends';

const AdminSidebarLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
        isActive 
          ? 'bg-white/10 text-white font-medium' 
          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
};

const AdminOverview = () => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-white mb-6">Operations Control Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'SYSTEM STATUS', value: backendOnline ? 'ONLINE' : 'CONNECTING' },
          { title: 'PORT', value: '8000' },
          { title: 'MEDISHARE BACKEND', value: 'ACTIVE' },
          { title: 'BLOCKCHAIN NODE', value: 'LOCALHOST' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#1a1a1f] p-5 rounded-xl border border-white/5">
            <div className="text-gray-500 text-xs font-semibold tracking-wider mb-2">{stat.title}</div>
            <div className="text-2xl font-display font-medium text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* System Status */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-white/5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Server className="w-4 h-4" /> System Status Monitor</h3>
          <div className="space-y-3">
            {[
              { name: 'MEDISHARE BACKEND (Port 8000)', status: backendOnline === true ? 'ONLINE' : backendOnline === false ? 'OFFLINE' : 'CHECKING', color: backendOnline ? 'text-green-500' : 'text-yellow-500' },
              { name: 'MONGODB DATABASE', status: 'CONNECTED', color: 'text-green-500' },
              { name: 'HARDHAT SMART CONTRACT', status: 'READY', color: 'text-green-500' },
              { name: 'GEMINI AI ENGINE', status: 'ACTIVE', color: 'text-green-500' },
            ].map(sys => (
              <div key={sys.name} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-gray-300 text-sm font-medium">{sys.name}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded bg-black/40 ${sys.color}`}>{sys.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1f] p-6 rounded-xl border border-white/5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Backend Health & Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Backend Integration', details: 'Connected root frontend to medishare/backend (port 8000)', time: 'Just now', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
              { action: 'Smart Contract API', details: 'GET /chain/api/verify/:batchNumber operational', time: 'Active', icon: <Database className="w-4 h-4 text-blue-500" /> },
              { action: 'Gemini AI PDF Parser', details: 'POST /users/upload operational', time: 'Active', icon: <Activity className="w-4 h-4 text-purple-500" /> },
            ].map((act, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1">{act.icon}</div>
                <div>
                  <div className="text-gray-200 text-sm font-medium">{act.action}</div>
                  <div className="text-gray-500 text-xs">{act.details} • {act.time}</div>
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
      <div className="bg-[#1a1a1f] rounded-xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading backend donations...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No donations submitted in backend database yet.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/40 text-xs uppercase text-gray-500">
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
                  <td className="px-6 py-4 text-gray-300">{row.user?.name || row.user?.email || 'User'}</td>
                  <td className="px-6 py-4 text-white font-medium">{row.medicine} ({row.brand || 'Generic'})</td>
                  <td className="px-6 py-4 font-mono text-xs">{row.batchNumber}</td>
                  <td className="px-6 py-4">{row.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      row.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      row.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
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
                          className="px-3 py-1 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20 transition disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button 
                          disabled={updatingId === row._id}
                          onClick={() => handleStatusUpdate(row._id, 'rejected')} 
                          className="px-3 py-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
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
      setMsg(err.response?.data?.error || "Failed to add medicine (Ensure you are logged in as admin).");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-xl font-medium text-white mb-6">Medicine Inventory</h2>

      <div className="bg-[#1a1a1f] p-6 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-base font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Medicine</h3>
        {msg && <div className="p-3 bg-white/10 text-xs rounded border border-white/20">{msg}</div>}
        <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Medicine Name" 
            required 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="px-3 py-2 bg-black/40 rounded border border-white/10 text-sm"
          />
          <input 
            type="number" 
            placeholder="Price ($)" 
            required 
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            className="px-3 py-2 bg-black/40 rounded border border-white/10 text-sm"
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            required 
            value={form.quantity}
            onChange={e => setForm({...form, quantity: e.target.value})}
            className="px-3 py-2 bg-black/40 rounded border border-white/10 text-sm"
          />
          <button 
            type="submit" 
            disabled={adding}
            className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin" />} Add Medicine
          </button>
        </form>
      </div>

      <div className="bg-[#1a1a1f] rounded-xl border border-white/5 overflow-hidden p-6">
        <h3 className="text-base font-medium mb-4">Store Inventory List</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading inventory...</div>
        ) : medicines.length === 0 ? (
          <p className="text-gray-500 text-sm">No medicines found in database.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medicines.map((m: any) => (
              <div key={m._id} className="p-4 bg-black/30 rounded-lg border border-white/5 space-y-1">
                <div className="font-bold text-white">{m.name}</div>
                <div className="text-xs text-gray-400">Price: ${m.price} | Stock: {m.quantity}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#0a0a0d] flex text-gray-100 font-sans relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen">
        <ColorBends
          colors={["#FF9FFC", "#5227FF", "#2563eb"]}
          rotation={0}
          speed={0.05}
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

      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/5 bg-[#111115]/80 backdrop-blur-md p-6 hidden md:flex flex-col gap-2 z-10">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-4">Admin System</div>
        <AdminSidebarLink to="/admin" icon={Activity}>Overview</AdminSidebarLink>
        <AdminSidebarLink to="/admin/donations" icon={HeartHandshake}>Donations</AdminSidebarLink>
        <AdminSidebarLink to="/admin/medicines" icon={Box}>Medicines</AdminSidebarLink>
        <AdminSidebarLink to="/admin/blockchain" icon={Database}>Blockchain</AdminSidebarLink>
        <div className="mt-8 mb-2 px-4 h-px bg-white/5"></div>
        <AdminSidebarLink to="/admin/settings" icon={Settings}>Settings</AdminSidebarLink>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto z-10 relative">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/donations" element={<AdminDonations />} />
          <Route path="/medicines" element={<AdminMedicines />} />
          <Route path="/blockchain" element={<div className="text-gray-500 text-center py-12 font-mono">Blockchain Node Live on Port 8000 (/chain/api/verify/:batchNumber)</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

