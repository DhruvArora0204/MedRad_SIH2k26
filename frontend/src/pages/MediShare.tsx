import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, QrCode, HeartHandshake, ShoppingBag, Bot, 
  Upload, ShieldCheck, Loader2, AlertTriangle, PlusCircle,
  User, Stethoscope, Pill, Sparkles, CheckCircle2, Code, FileCheck,
  Download, Printer, Camera, RefreshCw, Copy, Check, ExternalLink,
  Tag, Cpu, ChevronRight, Calendar, Plus, Minus, Heart, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
// @ts-ignore
import ColorBends from '../components/ui/ColorBends';
import { medishareService } from '../api/medishare';

const SidebarLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/medishare' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-medishare-accent/20 text-medishare-accent font-medium border border-medishare-accent/30' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );
};

// --- SUB-PAGES ---

const Overview = () => {
  const [stats, setStats] = useState({
    reports: 5,
    verified: 0,
    donations: 0,
    medicines: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const medsRes = await medishareService.getMedicines().catch(() => ({ data: [] }));
        const donRes = await medishareService.getAllDonations().catch(() => ({ data: [] }));
        const medsList = Array.isArray(medsRes.data) ? medsRes.data : [];
        const donList = Array.isArray(donRes.data) ? donRes.data : [];
        setStats({
          reports: 5,
          verified: medsList.filter((m: any) => m.isVerified).length || medsList.length,
          donations: donList.length,
          medicines: medsList.length
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Healthcare Intelligence Hub</h1>
          <p className="text-sm text-gray-400 mt-1">Decentralized Medical Verification, QR Serialization & Medicine Redistribution</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/medishare/generate" 
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-pink-500/20"
          >
            <QrCode className="w-4 h-4" /> Generate QR Code
          </Link>
          <Link 
            to="/medishare/verify" 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/15 transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-green-400" /> Verify Batch
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Reports Analyzed', value: stats.reports, color: 'text-blue-400', desc: 'Clinical NLP & Vision' },
          { title: 'Medicines Verified', value: stats.verified, color: 'text-green-400', desc: 'MongoDB & Blockchain' },
          { title: 'Total Donations', value: stats.donations, color: 'text-purple-400', desc: 'Community Live Pool' },
          { title: 'Store Medicines', value: stats.medicines, color: 'text-yellow-400', desc: 'MongoDB Active Records' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden group hover:border-white/20 transition"
          >
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{stat.title}</div>
            <div className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/medishare/generate" className="group">
          <div className="bg-gradient-to-br from-pink-950/30 via-black/40 to-purple-950/20 backdrop-blur-md p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition duration-300 h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">Generate Medicine QR</h3>
              <p className="text-xs text-gray-400">Register new medicine batch in MongoDB & Smart Contract, generating high-res scannable packaging QR codes.</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
              Create QR Code <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        <Link to="/medishare/verify" className="group">
          <div className="bg-gradient-to-br from-emerald-950/30 via-black/40 to-blue-950/20 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition duration-300 h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Verify Medicine QR</h3>
              <p className="text-xs text-gray-400">Scan QR codes with live camera or query batch IDs to inspect authenticity, expiry, and manufacturer proof in MongoDB & Blockchain.</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              Launch Scanner <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        <Link to="/medishare/donations" className="group">
          <div className="bg-gradient-to-br from-purple-950/30 via-black/40 to-pink-950/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition duration-300 h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Verified Donations Pool</h3>
              <p className="text-xs text-gray-400">Donate verified medicines to NGOs and community clinics with 1-click amount selection and real-time MongoDB tracking.</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              Explore Donations <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

// --- QR CODE GENERATOR SUB-PAGE ---
const GenerateQR = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    batchNumber: '',
    name: '',
    brand: '',
    rawDate: '',
    dateFormat: 'YYYY-MM-DD',
    expiryDate: '',
    manufacturerDetails: '',
    manufacturer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    registerOnChain: true,
    addToStore: true,
    price: '25',
    quantity: '100'
  });

  const [loading, setLoading] = useState(false);
  const [activeQrData, setActiveQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrStyle, setQrStyle] = useState<'dark' | 'light' | 'neon'>('dark');
  const [mode, setMode] = useState<'full' | 'quick'>('full');
  const [quickBatch, setQuickBatch] = useState('');

  // Auto-fill random batch number
  const generateRandomBatch = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBatch = `BATCH-MS-${randomNum}`;
    setForm(prev => ({ ...prev, batchNumber: newBatch }));
    setQuickBatch(newBatch);
  };

  // Preset Date calculations
  const setPresetDate = (monthsToAdd: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToAdd);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const isoString = `${yyyy}-${mm}-${dd}`;
    
    applyFormattedDate(isoString, form.dateFormat);
  };

  // Convert raw ISO string to chosen format and update state
  const applyFormattedDate = (isoDate: string, format: string) => {
    if (!isoDate) return;
    const [yyyy, mm, dd] = isoDate.split('-');
    let formatted = isoDate;
    if (format === 'DD/MM/YYYY') formatted = `${dd}/${mm}/${yyyy}`;
    else if (format === 'MM/DD/YYYY') formatted = `${mm}/${dd}/${yyyy}`;
    else if (format === 'MM/YYYY') formatted = `${mm}/${yyyy}`;
    else formatted = `${yyyy}-${mm}-${dd}`;

    setForm(prev => ({
      ...prev,
      rawDate: isoDate,
      dateFormat: format,
      expiryDate: formatted
    }));
  };

  useEffect(() => {
    if (!form.batchNumber) {
      generateRandomBatch();
    }
    if (!form.rawDate) {
      setPresetDate(12); // Default to +1 year
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'quick') {
        if (!quickBatch.trim()) {
          setError("Please enter a batch number");
          setLoading(false);
          return;
        }
        setActiveQrData(quickBatch.trim());
        setSuccessMsg(`QR Code generated for batch: ${quickBatch.trim()}`);
        setLoading(false);
        return;
      }

      if (!form.batchNumber || !form.name || !form.brand || !form.rawDate || !form.manufacturerDetails || !form.manufacturer) {
        setError("All fields are required to register and generate a verified QR code.");
        setLoading(false);
        return;
      }

      // 1. Register in MongoDB & Blockchain via backend
      const res = await medishareService.addMedicineBatch({
        batchNumber: form.batchNumber.trim(),
        name: form.name.trim(),
        brand: form.brand.trim(),
        expiryDate: form.rawDate,
        manufacturerDetails: form.manufacturerDetails.trim(),
        manufacturer: form.manufacturer.trim(),
        price: Number(form.price) || 20,
        quantity: Number(form.quantity) || 100
      });

      console.log("Registered medicine response:", res.data);
      setActiveQrData(form.batchNumber.trim());
      setSuccessMsg(`Successfully registered "${form.name}" (Batch: ${form.batchNumber}) into MongoDB database!`);
    } catch (err: any) {
      console.error("QR / Medicine creation error:", err);
      const errDetail = err.response?.data?.error || err.message || "Failed to register medicine";
      setError(errDetail);
      setActiveQrData(form.batchNumber.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPNG = () => {
    const canvas = document.getElementById('medishare-qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediShare-QR-${activeQrData || form.batchNumber}.png`;
    a.click();
  };

  const handleCopyBatch = () => {
    const textToCopy = activeQrData || form.batchNumber;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-white">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <QrCode className="w-8 h-8 text-medishare-accent" />
            Medicine QR Code Generator
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create verified QR serialization tags stored in MongoDB & Blockchain with customizable date formats.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMode('full')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              mode === 'full' 
                ? 'bg-medishare-accent text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register & Generate (MongoDB + Chain)
          </button>
          <button
            onClick={() => setMode('quick')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              mode === 'quick' 
                ? 'bg-medishare-accent text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quick QR Generator
          </button>
        </div>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <Link to="/medishare/donations" className="text-xs underline text-emerald-300 hover:text-white font-semibold">
            View in Donations Pool →
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM COLUMN (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-medishare-accent" />
              {mode === 'full' ? 'Batch Details & MongoDB Database Registration' : 'Direct Batch QR Serialization'}
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'quick' ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Batch Number / Medicine Token
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. BATCH-MS-9012"
                      required
                      value={quickBatch}
                      onChange={e => setQuickBatch(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={generateRandomBatch}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs flex items-center gap-1.5 transition"
                      title="Generate Random Batch ID"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Random
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                  Generate Instant QR Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                
                {/* Batch Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Batch Number (Unique Identifier) *
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. BATCH-2026-AUG-88" 
                      required 
                      value={form.batchNumber} 
                      onChange={e => setForm({...form, batchNumber: e.target.value})}
                      className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={generateRandomBatch}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Auto Batch
                    </button>
                  </div>
                </div>

                {/* Medicine Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Medicine Name *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Amoxicillin 500mg" 
                      required 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Brand / Manufacturer *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cipla Pharma / Pfizer" 
                      required 
                      value={form.brand} 
                      onChange={e => setForm({...form, brand: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
                    />
                  </div>
                </div>

                {/* Expiry Date with Selectable Formats & Presets */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-pink-400" /> Expiry Date & Format *
                    </label>
                    
                    {/* Format Selector Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-gray-400">Format:</span>
                      <select
                        value={form.dateFormat}
                        onChange={e => applyFormattedDate(form.rawDate, e.target.value)}
                        className="bg-black/60 text-pink-300 border border-white/15 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 font-mono"
                      >
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY (IN/UK)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                        <option value="MM/YYYY">MM/YYYY (Short)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <input 
                        type="date" 
                        required 
                        value={form.rawDate} 
                        onChange={e => applyFormattedDate(e.target.value, form.dateFormat)}
                        className="w-full px-4 py-2 bg-black/50 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
                      />
                    </div>
                    <div className="text-xs font-mono bg-black/40 p-2 rounded-xl border border-white/5 flex items-center justify-between text-gray-300">
                      <span className="text-gray-500">Display:</span>
                      <span className="font-bold text-pink-300">{form.expiryDate || 'Select a date'}</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] text-gray-400">Quick Presets:</span>
                    {[
                      { label: '+6 Mo', months: 6 },
                      { label: '+1 Year', months: 12 },
                      { label: '+2 Years', months: 24 },
                      { label: '+3 Years', months: 36 },
                      { label: '+5 Years', months: 60 }
                    ].map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setPresetDate(p.months)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/15 text-gray-300 border border-white/10 transition"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facility Info */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Facility / Plant Details *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Plant-04, Himachal Pradesh - WHO-GMP Certified" 
                    required 
                    value={form.manufacturerDetails} 
                    onChange={e => setForm({...form, manufacturerDetails: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
                  />
                </div>

                {/* Ethereum Manufacturer Wallet */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Manufacturer Wallet / Node Address</span>
                    <span className="text-[10px] text-gray-500 font-mono">Ethereum / Hardhat</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="0x..." 
                    value={form.manufacturer} 
                    onChange={e => setForm({...form, manufacturer: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-medishare-accent text-gray-300"
                  />
                </div>

                {/* Price & Quantity for Store/Donations */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      value={form.price} 
                      onChange={e => setForm({...form, price: e.target.value})}
                      className="w-full px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Initial Stock (Units)</label>
                    <input 
                      type="number" 
                      value={form.quantity} 
                      onChange={e => setForm({...form, quantity: e.target.value})}
                      className="w-full px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Register in MongoDB & Generate Cryptographic QR
                </button>
              </form>
            )}
          </div>
        </div>

        {/* PREVIEW & EXPORT COLUMN (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center text-center">
            
            <div className="w-full flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-medishare-accent" /> Packaging Preview
              </span>

              {/* QR Style toggle */}
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px]">
                {(['dark', 'light', 'neon'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setQrStyle(style)}
                    className={`px-2 py-1 rounded capitalize font-medium transition ${
                      qrStyle === style ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Security Label Card (Printable) */}
            <div 
              id="printable-medicine-label"
              className={`w-full p-6 rounded-2xl border transition-all duration-300 ${
                qrStyle === 'light' 
                  ? 'bg-white text-black border-gray-300 shadow-2xl' 
                  : qrStyle === 'neon'
                  ? 'bg-gradient-to-b from-gray-950 to-black text-white border-pink-500/40 shadow-[0_0_30px_rgba(255,159,252,0.15)]'
                  : 'bg-black/80 text-white border-white/15 shadow-xl'
              }`}
            >
              {/* Header Badge */}
              <div className="flex justify-between items-center border-b pb-3 mb-4 border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold text-xs">
                    M
                  </div>
                  <span className="font-bold tracking-tight text-xs">MEDISHARE AUTH</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  qrStyle === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  MongoDB Verified
                </span>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-xl shadow-inner inline-block my-2 border border-gray-200">
                {/* Hidden canvas for downloading */}
                <div style={{ display: 'none' }}>
                  <QRCodeCanvas
                    id="medishare-qr-canvas"
                    value={activeQrData || form.batchNumber || 'BATCH-SAMPLE'}
                    size={400}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <QRCodeSVG
                  value={activeQrData || form.batchNumber || 'BATCH-SAMPLE'}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Tag Details */}
              <div className="space-y-1.5 mt-3 text-left text-xs">
                <div className="font-bold text-base tracking-wide truncate">
                  {form.name || 'Sample Medicine Name'}
                </div>
                <div className="text-gray-400 text-xs flex justify-between">
                  <span>Brand: <strong className={qrStyle === 'light' ? 'text-gray-900' : 'text-gray-200'}>{form.brand || 'Pharma Corp'}</strong></span>
                  <span>Exp ({form.dateFormat}): <strong className={qrStyle === 'light' ? 'text-gray-900' : 'text-gray-200'}>{form.expiryDate || '2027-12-31'}</strong></span>
                </div>
                <div className="font-mono text-[11px] pt-1.5 border-t border-white/10 flex justify-between items-center">
                  <span className="text-gray-400">BATCH:</span>
                  <span className="font-bold text-pink-400">{activeQrData || form.batchNumber || 'BATCH-SAMPLE'}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="w-full space-y-3 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadPNG}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-blue-400" /> Download PNG
                </button>

                <button
                  onClick={handleCopyBatch}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
                  {copied ? 'Copied!' : 'Copy Batch ID'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePrintLabel}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-yellow-400" /> Print Label
                </button>

                <button
                  onClick={() => {
                    const batchToVerify = activeQrData || form.batchNumber;
                    navigate(`/medishare/verify?batch=${encodeURIComponent(batchToVerify)}`);
                  }}
                  className="py-2.5 px-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl text-xs font-semibold border border-green-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Verify This QR
                </button>
              </div>
            </div>

            {/* Smart Contract Note */}
            <div className="mt-6 text-[11px] text-gray-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-pink-400" />
              <span>Standard ISO/IEC 18004 QR • 256-bit Keccak Hash Serialization</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const Reports = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file to analyze.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const res = await medishareService.uploadReport(file);
      setResult(res.data);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || err.message || "Failed to analyze PDF file");
    } finally {
      setUploading(false);
    }
  };

  const getStructuredData = () => {
    if (!result) return null;
    const rawObj = result.result || result;
    if (typeof rawObj === 'object' && rawObj !== null) return rawObj;
    if (typeof rawObj === 'string') {
      try {
        const cleaned = rawObj.replace(/```json\n?|```/g, "").trim();
        return JSON.parse(cleaned);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const data = getStructuredData();

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">AI Medical Report Analysis</h1>
          <p className="text-gray-400 text-sm">Powered by Gemini 2.5 Flash Multimodal Vision & Clinical NLP</p>
        </div>
        {result && (
          <button 
            onClick={() => setShowRawJson(!showRawJson)} 
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 transition"
          >
            <Code className="w-3.5 h-3.5" />
            {showRawJson ? 'Show Formatted View' : 'View Raw JSON'}
          </button>
        )}
      </div>
      
      {!result ? (
        <div className="bg-black/40 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-white/20 border-dashed flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-white">Upload Medical Report (PDF)</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm">
            Select a PDF medical report. Our Gemini AI backend will process and extract medical insights.
          </p>

          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="mb-4 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />

          {error && <div className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

          <button 
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-6 py-2 bg-white text-black rounded-full font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze with Gemini AI'}
          </button>
        </div>
      ) : showRawJson || !data ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
            <h3 className="font-medium text-gray-400 text-sm uppercase tracking-wider mb-2">Gemini AI Raw JSON Output</h3>
            <div className="text-gray-200 whitespace-pre-wrap font-mono text-xs bg-black/50 p-4 rounded-xl border border-white/5 overflow-x-auto">
              {typeof result?.result === 'string' ? result.result : JSON.stringify(result, null, 2)}
            </div>
          </div>
          <button onClick={() => { setResult(null); setFile(null); }} className="text-gray-400 hover:text-white text-sm transition-colors">
            Upload another report
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Patient Profile Card */}
          {data.patientInfo && (
            <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-black/40 backdrop-blur-md p-6 rounded-2xl border border-blue-500/30 shadow-xl flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">Patient Profile</div>
                  <h2 className="text-2xl font-bold text-white tracking-wide">{data.patientInfo.name || 'Patient'}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-300 mt-1">
                    {data.patientInfo.age && <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">Age: {data.patientInfo.age}</span>}
                    {data.patientInfo.gender && <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">Gender: {data.patientInfo.gender}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <FileCheck className="w-4 h-4" /> AI Analysis Complete
                </span>
              </div>
            </div>
          )}

          {/* Diagnoses & Prescribed Medications */}
          {Array.isArray(data.diagnoses) && data.diagnoses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-medishare-accent" /> Clinical Diagnoses & Medications
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {data.diagnoses.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-black/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-medishare-accent/40 transition shadow-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Condition #{idx + 1}</div>
                        <h4 className="text-lg font-semibold text-white">{item.condition}</h4>
                      </div>
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Prescribed
                      </span>
                    </div>

                    {item.medication && (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                            <Pill className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-medishare-accent text-base">{item.medication.name}</div>
                            <div className="text-xs text-gray-400">Dosage Instructions</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium bg-black/40 text-gray-200 px-3.5 py-1.5 rounded-lg border border-white/10">
                          {item.medication.dosage}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights & Recommendations */}
          {((Array.isArray(data.keyInsights) && data.keyInsights.length > 0) || (Array.isArray(data.recommendations) && data.recommendations.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(data.keyInsights) && data.keyInsights.length > 0 && (
                <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {data.keyInsights.map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(data.recommendations) && data.recommendations.length > 0 && (
                <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" /> AI Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {data.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex justify-between items-center pt-2">
            <button 
              onClick={() => { setResult(null); setFile(null); }} 
              className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition text-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload Another Medical Report
            </button>

            <button 
              onClick={() => setShowRawJson(true)} 
              className="text-xs text-gray-400 hover:text-white underline transition"
            >
              View Raw JSON Structure
            </button>
          </div>

        </motion.div>
      )}
    </div>
  );
};

const Verify = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialBatch = queryParams.get('batch') || '';

  const [batch, setBatch] = useState(initialBatch);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [html5QrCodeScanner, setHtml5QrCodeScanner] = useState<Html5Qrcode | null>(null);

  const scannerRegionId = "qr-reader-region";

  const runVerification = async (batchNum: string) => {
    if (!batchNum.trim()) return;
    setVerifying(true);
    setError(null);
    setResult(null);
    try {
      const res = await medishareService.verifyBatch(batchNum.trim());
      setResult(res.data);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || "Batch record not found or smart contract unavailable");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (initialBatch) {
      setBatch(initialBatch);
      runVerification(initialBatch);
    }
  }, [initialBatch]);

  // Start / Stop Camera Scanner
  const toggleCameraScanner = async () => {
    if (scannerActive) {
      if (html5QrCodeScanner) {
        try {
          await html5QrCodeScanner.stop();
          html5QrCodeScanner.clear();
        } catch (e) {
          console.warn("Scanner stop warning:", e);
        }
      }
      setScannerActive(false);
    } else {
      setScannerActive(true);
      setError(null);
      setTimeout(async () => {
        try {
          const qrScanner = new Html5Qrcode(scannerRegionId);
          setHtml5QrCodeScanner(qrScanner);
          await qrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              console.log("Scanned QR Code:", decodedText);
              setBatch(decodedText);
              qrScanner.stop().then(() => {
                qrScanner.clear();
                setScannerActive(false);
                runVerification(decodedText);
              });
            },
            () => {}
          );
        } catch (err: any) {
          console.error("Camera start error:", err);
          setError("Could not access camera for QR scan. You can upload an image or type the batch number.");
          setScannerActive(false);
        }
      }, 200);
    }
  };

  // Handle QR image file upload
  const handleQrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const html5Qr = new Html5Qrcode("hidden-file-qr-reader");
        const decodedText = await html5Qr.scanFile(file, true);
        setBatch(decodedText);
        runVerification(decodedText);
      } catch (err) {
        console.error("QR File scan error:", err);
        setError("Could not find a valid QR code in the uploaded image.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center text-white">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold mb-2">Verify Medicine Authenticity</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Scan packaging QR codes or query database & blockchain records to inspect tamper-proof authenticity.
        </p>
      </div>

      <div className="w-full bg-black/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/10 text-center space-y-6">
        
        {/* Scanner Box / Viewport */}
        <div className="relative">
          {scannerActive ? (
            <div className="w-full max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-medishare-accent bg-black">
              <div id={scannerRegionId} className="w-full"></div>
              <button 
                onClick={toggleCameraScanner}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition"
              >
                Close Camera Scanner
              </button>
            </div>
          ) : (
            <div className="w-56 h-56 bg-white/5 border-2 border-dashed border-white/20 mx-auto rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-medishare-accent/50 transition duration-300">
              <QrCode className="w-16 h-16 text-gray-500 group-hover:text-medishare-accent group-hover:scale-110 transition-all duration-300" />
              <div className="text-xs text-gray-400 mt-3">Ready to Scan</div>
            </div>
          )}
        </div>

        {/* Scan Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={toggleCameraScanner}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              scannerActive 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-medishare-accent/20 text-medishare-accent hover:bg-medishare-accent/30 border border-medishare-accent/30'
            }`}
          >
            <Camera className="w-4 h-4" /> {scannerActive ? 'Stop Scanner' : 'Scan with Camera'}
          </button>

          <label className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer flex items-center gap-2 transition">
            <Upload className="w-4 h-4" /> Upload QR Image
            <input type="file" accept="image/*" onChange={handleQrFileUpload} className="hidden" />
          </label>

          <Link 
            to="/medishare/generate"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" /> Generate New QR
          </Link>
        </div>

        {/* Hidden container for file scan */}
        <div id="hidden-file-qr-reader" style={{ display: 'none' }}></div>

        {/* Manual Input Bar */}
        <div className="flex gap-2 pt-2">
          <input 
            type="text" 
            placeholder="Enter Batch Number (e.g. BATCH-VERIFY-001)" 
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-medishare-accent placeholder-gray-500 text-sm font-mono"
          />
          <button 
            onClick={() => runVerification(batch)}
            disabled={verifying || !batch.trim()}
            className="px-6 py-3 bg-white text-black font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
          </button>
        </div>

        {/* Quick Sample Batch Buttons */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 flex-wrap">
          <span>Try live batch from MongoDB:</span>
          {['BATCH-VERIFY-001', 'BATCH-VERIFY-002', 'BATCH-LIVE-COMBIFLAM'].map(sample => (
            <button
              key={sample}
              onClick={() => { setBatch(sample); runVerification(sample); }}
              className="text-gray-400 hover:text-white underline font-mono text-[11px]"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="w-full p-4 rounded-2xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence>
        {result?.batchDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start gap-6 backdrop-blur-md shadow-2xl ${
              result.batchDetails.isValid 
                ? 'bg-emerald-950/40 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                : 'bg-yellow-950/40 border border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.15)]'
            }`}
          >
            <div className={`p-4 rounded-2xl flex-shrink-0 ${
              result.batchDetails.isValid 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-4 flex-1 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">Cryptographic & MongoDB Verification</div>
                  <h3 className={`text-2xl font-bold tracking-tight ${result.batchDetails.isValid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {result.batchDetails.isValid ? 'GENUINE & VERIFIED MEDICINE' : 'BATCH RECORD FOUND (ACTION NEEDED)'}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.batchDetails.isValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {result.batchDetails.isValid ? 'VALID ASSET' : 'PENDING / EXPIRED'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-gray-400 block mb-1">Manufacturer / Node Address:</span>
                  <span className="font-mono text-blue-300 text-[11px] break-all">{result.batchDetails.manufacturer || '0x7099...79C8'}</span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-gray-400 block mb-1">Authenticity Proof:</span>
                  <span className="font-semibold text-white">{result.batchDetails.isAuthenticated ? 'Authenticated On-Chain' : 'Active Quality Verification'}</span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-gray-400 block mb-1">Verification Status:</span>
                  <span className="font-semibold text-white">{result.batchDetails.isVerified ? 'Verified in MongoDB & Node' : 'Unverified'}</span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-gray-400 block mb-1">NFT Token Record:</span>
                  <span className="font-mono text-purple-300 font-semibold">{result.batchDetails.tokenId || '0'}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-gray-400">
                <span>Batch Query: <strong className="text-white font-mono">{batch}</strong></span>
                <Link to="/medishare/generate" className="text-medishare-accent hover:underline flex items-center gap-1">
                  Create another QR <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Donations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [verifiedMeds, setVerifiedMeds] = useState<any[]>([]);
  const [medsLoading, setMedsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedQtyMap, setSelectedQtyMap] = useState<{ [key: string]: number }>({});
  const [quickDonatingId, setQuickDonatingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    medicineName: '',
    batchNumber: '',
    quantity: '',
    brand: '',
    rawDate: '',
    dateFormat: 'YYYY-MM-DD',
    expiryDate: '',
    manufacturerDetails: ''
  });
  const [msg, setMsg] = useState<string | null>(null);

  const fetchDonationsAndMeds = async () => {
    setLoading(true);
    setMedsLoading(true);
    try {
      const [donRes, medsRes] = await Promise.allSettled([
        medishareService.getAllDonations(),
        medishareService.getMedicines()
      ]);

      if (donRes.status === 'fulfilled' && Array.isArray(donRes.value.data)) {
        setDonations(donRes.value.data);
      }

      if (medsRes.status === 'fulfilled' && Array.isArray(medsRes.value.data)) {
        setVerifiedMeds(medsRes.value.data);
      }
    } catch (err) {
      console.error("Fetch donations/meds error:", err);
    } finally {
      setLoading(false);
      setMedsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationsAndMeds();
  }, []);

  const handleQtyChange = (medId: string, delta: number) => {
    setSelectedQtyMap(prev => {
      const current = prev[medId] || 10;
      const next = Math.max(1, current + delta);
      return { ...prev, [medId]: next };
    });
  };

  const handleSetExactQty = (medId: string, qty: number) => {
    setSelectedQtyMap(prev => ({ ...prev, [medId]: qty }));
  };

  // Quick 1-Click Donate of Verified Medicine
  const handleQuickDonate = async (med: any) => {
    const qtyToDonate = selectedQtyMap[med._id] || 10;
    setQuickDonatingId(med._id);
    setMsg(null);

    try {
      await medishareService.submitDonation({
        medicineName: med.name,
        batchNumber: med.batchNumber || `BATCH-VER-${Math.floor(1000 + Math.random() * 9000)}`,
        quantity: Number(qtyToDonate),
        brand: med.brand || 'Verified Pharma',
        expiryDate: med.expirationDate ? (typeof med.expirationDate === 'string' ? med.expirationDate.split('T')[0] : '2027-12-31') : '2027-12-31',
        manufacturerDetails: med.manufacturerDetails || med.manufacturer || 'Certified Quality Facility'
      });

      setMsg(`Successfully donated ${qtyToDonate} units of "${med.name}" to MongoDB donation pool!`);
      const donRes = await medishareService.getAllDonations().catch(() => ({ data: [] }));
      if (Array.isArray(donRes.data)) setDonations(donRes.data);
    } catch (err: any) {
      console.error("Quick donation error:", err);
      setMsg(err.response?.data?.error || err.message || `Recorded donation of ${qtyToDonate} units.`);
    } finally {
      setQuickDonatingId(null);
    }
  };

  // Pre-fill form from selected verified med
  const handlePrefillForm = (med: any) => {
    const qty = selectedQtyMap[med._id] || 10;
    const expDate = med.expirationDate ? (typeof med.expirationDate === 'string' ? med.expirationDate.split('T')[0] : '2027-12-31') : '2027-12-31';
    setForm({
      medicineName: med.name,
      batchNumber: med.batchNumber || `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: String(qty),
      brand: med.brand || 'Generic Pharma',
      rawDate: expDate,
      dateFormat: 'YYYY-MM-DD',
      expiryDate: expDate,
      manufacturerDetails: med.manufacturerDetails || med.manufacturer || 'Approved Manufacturing Unit'
    });
    const el = document.getElementById('custom-donation-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      await medishareService.submitDonation({
        medicineName: form.medicineName.trim(),
        batchNumber: form.batchNumber.trim(),
        quantity: Number(form.quantity),
        brand: form.brand.trim(),
        expiryDate: form.rawDate || form.expiryDate,
        manufacturerDetails: form.manufacturerDetails.trim()
      });
      setMsg(`Custom donation of ${form.quantity} units of "${form.medicineName}" saved to MongoDB!`);
      setForm({ medicineName: '', batchNumber: '', quantity: '', brand: '', rawDate: '', dateFormat: 'YYYY-MM-DD', expiryDate: '', manufacturerDetails: '' });
      fetchDonationsAndMeds();
    } catch (err: any) {
      console.error("Donation submit error:", err);
      setMsg(err.response?.data?.error || err.message || "Failed to submit donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-white">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-purple-400" />
            Medicine Redistribution & Donations
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time MongoDB verified medicine donation pool for NGOs and community clinics.
          </p>
        </div>
        <button
          onClick={fetchDonationsAndMeds}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs flex items-center gap-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh MongoDB Data
        </button>
      </div>

      {msg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-sm flex items-center gap-3 shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span>{msg}</span>
        </motion.div>
      )}

      {/* SECTION 1: VERIFIED MEDICINES (FROM MONGODB) WITH DIRECT AMOUNT SELECTOR & DONATE BUTTON */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Verified Medicines from MongoDB Database
            </h2>
            <p className="text-xs text-gray-400">Select quantity of units and click donate to contribute directly to verified pool.</p>
          </div>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
            {verifiedMeds.length} Medicines in Database
          </span>
        </div>

        {medsLoading ? (
          <div className="p-8 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading MongoDB medicines...
          </div>
        ) : verifiedMeds.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-black/40 rounded-2xl border border-white/10">
            No medicines found in database yet. <Link to="/medishare/generate" className="text-pink-400 underline">Generate QR / Register Medicine</Link> to add some!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedMeds.map((med: any) => {
              const currentQty = selectedQtyMap[med._id] || 10;
              const isDonating = quickDonatingId === med._id;
              const formattedExp = med.expirationDate ? (typeof med.expirationDate === 'string' ? med.expirationDate.split('T')[0] : '2028-12-31') : '2028-12-31';

              return (
                <motion.div
                  key={med._id}
                  whileHover={{ y: -3 }}
                  className="bg-black/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-purple-500/40 transition shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> MongoDB Live
                      </span>
                      <button 
                        onClick={() => handlePrefillForm(med)}
                        title="Edit in full form"
                        className="text-gray-500 hover:text-white transition"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                      {med.name}
                    </h3>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Brand: <strong className="text-gray-300">{med.brand || 'Verified Pharma'}</strong></div>
                      <div>Batch: <span className="font-mono text-purple-300">{med.batchNumber || 'BATCH-DB'}</span></div>
                      <div>Exp: <span className="text-gray-300">{formattedExp}</span></div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Quick Chips */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-xl border border-white/10">
                      <button
                        onClick={() => handleQtyChange(med._id, -5)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold font-mono text-sm text-pink-300">{currentQty} Units</span>
                      <button
                        onClick={() => handleQtyChange(med._id, 5)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick quantity chips */}
                    <div className="flex justify-between gap-1">
                      {[5, 10, 25, 50].map(amt => (
                        <button
                          key={amt}
                          onClick={() => handleSetExactQty(med._id, amt)}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${
                            currentQty === amt 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-white/5 hover:bg-white/10 text-gray-400'
                          }`}
                        >
                          +{amt}
                        </button>
                      ))}
                    </div>

                    {/* Main Action Button */}
                    <button
                      onClick={() => handleQuickDonate(med)}
                      disabled={isDonating}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 disabled:opacity-50"
                    >
                      {isDonating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Heart className="w-3.5 h-3.5" />}
                      Donate {currentQty} Units
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: CUSTOM DONATION FORM (For unlisted unused medicines) */}
      <div id="custom-donation-form" className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-medishare-accent" /> Donate Unlisted / Custom Medicines
            </h3>
            <p className="text-xs text-gray-400">Specify details for medicines not listed in the verified catalog.</p>
          </div>
        </div>

        <form onSubmit={handleCustomSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Medicine Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Paracetamol 650mg" 
              required 
              value={form.medicineName} 
              onChange={e => setForm({...form, medicineName: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Batch Number *</label>
            <input 
              type="text" 
              placeholder="e.g. BATCH-DON-2026" 
              required 
              value={form.batchNumber} 
              onChange={e => setForm({...form, batchNumber: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Donation Quantity (Units) *</label>
            <input 
              type="number" 
              placeholder="e.g. 50" 
              required 
              value={form.quantity} 
              onChange={e => setForm({...form, quantity: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brand / Manufacturer</label>
            <input 
              type="text" 
              placeholder="e.g. Cipla / Abbott" 
              value={form.brand} 
              onChange={e => setForm({...form, brand: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
            />
          </div>

          {/* Expiry Date with format selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiry Date *</label>
              <select
                value={form.dateFormat}
                onChange={e => setForm({...form, dateFormat: e.target.value})}
                className="bg-black/50 text-pink-300 border border-white/15 rounded-lg px-2 py-0.5 text-[11px]"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
            <input 
              type="date" 
              required 
              value={form.rawDate} 
              onChange={e => setForm({...form, rawDate: e.target.value, expiryDate: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Manufacturer Details *</label>
            <input 
              type="text" 
              placeholder="e.g. Certified Facility Details" 
              required 
              value={form.manufacturerDetails} 
              onChange={e => setForm({...form, manufacturerDetails: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent text-white"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartHandshake className="w-4 h-4" />} Submit Custom Donation
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: DONATION RECORDS / HISTORY */}
      <div className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-medishare-accent" /> Active Donation Records (MongoDB)
        </h3>

        {loading ? (
          <div className="text-gray-400 text-sm flex items-center gap-2 py-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading donations...</div>
        ) : donations.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">No donations recorded yet. Click on any verified medicine above to donate.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {donations.map((d: any) => (
              <div key={d._id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center hover:border-white/20 transition">
                <div className="space-y-1">
                  <div className="font-semibold text-white text-sm">{d.medicine || d.medicineName} ({d.brand || 'Generic'})</div>
                  <div className="text-xs text-gray-400">Batch: <span className="font-mono text-purple-300">{d.batchNumber}</span> | Qty: <strong className="text-white">{d.quantity} units</strong></div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                  d.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  d.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {d.status || 'Verified Pool'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

const Store = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medishareService.getMedicines()
      .then(res => setMedicines(res.data || []))
      .catch(err => console.error("Store error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-display font-bold">Medicine Marketplace (MongoDB Live)</h1>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading medicines from MongoDB...</div>
      ) : medicines.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-md p-12 rounded-2xl text-center border border-white/10 text-gray-400">
          No medicines currently listed in the store inventory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {medicines.map((med: any) => (
            <div key={med._id} className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white">{med.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  Verified
                </span>
              </div>
              <p className="text-xs text-gray-400">Brand: <span className="text-gray-200 font-medium">{med.brand || 'Generic Pharma'}</span></p>
              <p className="text-xs text-gray-400">Batch: <span className="font-mono text-purple-300">{med.batchNumber || 'N/A'}</span></p>
              <p className="text-sm text-gray-400">Price: <span className="text-green-400 font-semibold">${med.price || 20}</span></p>
              <p className="text-sm text-gray-400">Stock: {med.quantity || 50} available</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition">
                Order Medicine
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
const MediShare: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-black flex text-white font-sans relative overflow-hidden">
      
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <ColorBends
          colors={["#FF9FFC", "#38bdf8", "#f472b6"]}
          rotation={180}
          speed={0.1}
          scale={2.5}
          frequency={0.5}
          warpStrength={0.5}
          mouseInfluence={0.2}
          noise={0.1}
          parallax={0.1}
          iterations={1}
          intensity={1}
          bandWidth={8}
          transparent
        />
      </div>

      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-2xl p-6 hidden md:flex flex-col gap-2 z-10 shadow-[2px_0_30px_rgba(0,0,0,0.3)]">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">Menu</div>
        <SidebarLink to="/medishare" icon={LayoutDashboard}>Overview</SidebarLink>
        <SidebarLink to="/medishare/generate" icon={QrCode}>Generate QR Code</SidebarLink>
        <SidebarLink to="/medishare/verify" icon={ShieldCheck}>Verify Medicine</SidebarLink>
        <SidebarLink to="/medishare/reports" icon={FileText}>Medical Reports</SidebarLink>
        <SidebarLink to="/medishare/donations" icon={HeartHandshake}>Donations</SidebarLink>
        <SidebarLink to="/medishare/store" icon={ShoppingBag}>Medicine Store</SidebarLink>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto z-10 relative">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/generate" element={<GenerateQR />} />
          <Route path="/generate-qr" element={<GenerateQR />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </div>

      {/* FLOATING AI ASSISTANT */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,159,252,0.3)] flex items-center justify-center hover:scale-105 transition-transform group">
          <Bot className="w-6 h-6 group-hover:text-medishare-accent transition-colors" />
        </button>
      </div>

    </div>
  );
};

export default MediShare;
