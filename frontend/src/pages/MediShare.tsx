import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, QrCode, HeartHandshake, ShoppingBag, Bot, 
  Upload, ShieldCheck, Loader2, AlertTriangle, PlusCircle,
  User, Stethoscope, Pill, Sparkles, CheckCircle2, Code, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    verified: 12,
    donations: 8,
    medicines: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const medsRes = await medishareService.getMedicines().catch(() => ({ data: [] }));
        const donRes = await medishareService.getAllDonations().catch(() => ({ data: [] }));
        setStats({
          reports: 5,
          verified: 12,
          donations: Array.isArray(donRes.data) ? donRes.data.length : 8,
          medicines: Array.isArray(medsRes.data) ? medsRes.data.length : 0
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Healthcare Intelligence Hub</h1>
          <p className="text-sm text-gray-400">Decentralized Medical Verification, Reports & Medicine Redistribution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Reports Analyzed', value: stats.reports, color: 'text-blue-400' },
          { title: 'Medicines Verified', value: stats.verified, color: 'text-green-400' },
          { title: 'Total Donations', value: stats.donations, color: 'text-purple-400' },
          { title: 'Store Medicines', value: stats.medicines, color: 'text-yellow-400' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10"
          >
            <div className="text-gray-400 text-sm mb-2">{stat.title}</div>
            <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
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

  // Extract structured data from result
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
  const [batch, setBatch] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!batch.trim()) return;
    setVerifying(true);
    setError(null);
    setResult(null);
    try {
      const res = await medishareService.verifyBatch(batch.trim());
      setResult(res.data);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || "Batch not found on blockchain");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 flex flex-col items-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Verify Medicine Authenticity</h1>
        <p className="text-gray-400">Enter batch number to query smart contract records on Ethereum / Hardhat backend.</p>
      </div>

      <div className="w-full bg-black/40 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/10 text-center">
        <div className="w-48 h-48 bg-white/5 border-2 border-dashed border-white/20 mx-auto rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden group">
          <QrCode className="w-16 h-16 text-gray-500 group-hover:text-medishare-accent transition-colors" />
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Batch Number (e.g. BATCH-101)" 
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-medishare-accent placeholder-gray-500"
          />
          <button 
            onClick={handleVerify}
            disabled={verifying || !batch}
            className="px-6 py-3 bg-white text-black font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full p-4 rounded-2xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          {error}
        </div>
      )}

      <AnimatePresence>
        {result?.batchDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-6 rounded-2xl flex items-start gap-4 backdrop-blur-md shadow-lg ${result.batchDetails.isValid ? 'bg-green-900/30 border border-green-500/30' : 'bg-yellow-900/30 border border-yellow-500/30'}`}
          >
            <div className={`p-3 rounded-full ${result.batchDetails.isValid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2 text-sm">
              <h3 className={`text-xl font-bold ${result.batchDetails.isValid ? 'text-green-400' : 'text-yellow-400'}`}>
                {result.batchDetails.isValid ? 'VALID BLOCKCHAIN BATCH' : 'BATCH RECORD FOUND'}
              </h3>
              <div className="text-gray-300 space-y-1">
                <p><strong className="text-gray-400">Verified:</strong> {result.batchDetails.isVerified ? 'Yes' : 'No'}</p>
                <p><strong className="text-gray-400">Authenticated:</strong> {result.batchDetails.isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong className="text-gray-400">Manufacturer Address:</strong> <span className="font-mono text-xs text-blue-300">{result.batchDetails.manufacturer}</span></p>
                {result.batchDetails.tokenId && <p><strong className="text-gray-400">NFT Token ID:</strong> {result.batchDetails.tokenId}</p>}
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    medicineName: '',
    batchNumber: '',
    quantity: '',
    brand: '',
    expiryDate: '',
    manufacturerDetails: ''
  });
  const [msg, setMsg] = useState<string | null>(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await medishareService.getAllDonations().catch(() => ({ data: [] }));
      if (Array.isArray(res.data)) setDonations(res.data);
    } catch (err) {
      console.error("Fetch donations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      await medishareService.submitDonation({
        ...form,
        quantity: Number(form.quantity)
      });
      setMsg("Donation submitted successfully!");
      setForm({ medicineName: '', batchNumber: '', quantity: '', brand: '', expiryDate: '', manufacturerDetails: '' });
      fetchDonations();
    } catch (err: any) {
      console.error("Donation submit error:", err);
      setMsg(err.response?.data?.error || err.message || "Failed to submit donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      <h1 className="text-2xl font-display font-bold">Medicine Donations</h1>

      {/* Donation Form */}
      <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-medishare-accent" /> Donate Unused Medicines
        </h3>
        
        {msg && <div className="mb-4 p-3 rounded-lg bg-white/10 text-sm border border-white/20">{msg}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Medicine Name (e.g. Paracetamol)" 
            required 
            value={form.medicineName} 
            onChange={e => setForm({...form, medicineName: e.target.value})}
            className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent"
          />
          <input 
            type="text" 
            placeholder="Batch Number" 
            required 
            value={form.batchNumber} 
            onChange={e => setForm({...form, batchNumber: e.target.value})}
            className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent"
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            required 
            value={form.quantity} 
            onChange={e => setForm({...form, quantity: e.target.value})}
            className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent"
          />
          <input 
            type="text" 
            placeholder="Brand (e.g. Cipla)" 
            value={form.brand} 
            onChange={e => setForm({...form, brand: e.target.value})}
            className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent"
          />
          <input 
            type="text" 
            placeholder="Expiry Date (e.g. 2026-12-31)" 
            value={form.expiryDate} 
            onChange={e => setForm({...form, expiryDate: e.target.value})}
            className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent"
          />
          <input 
            type="text" 
            placeholder="Manufacturer Details" 
            required 
            value={form.manufacturerDetails} 
            onChange={e => setForm({...form, manufacturerDetails: e.target.value})}
            className="px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-medishare-accent"
          />
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={submitting} 
              className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Submit Donation
            </button>
          </div>
        </form>
      </div>

      {/* Donation History */}
      <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-lg font-medium mb-4">Donation Records</h3>
        {loading ? (
          <div className="text-gray-400 text-sm flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading donations...</div>
        ) : donations.length === 0 ? (
          <p className="text-gray-500 text-sm">No donations recorded yet. Submit a donation above.</p>
        ) : (
          <div className="space-y-3">
            {donations.map((d: any) => (
              <div key={d._id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{d.medicine} ({d.brand || 'Generic'})</div>
                  <div className="text-xs text-gray-400">Batch: {d.batchNumber} | Qty: {d.quantity}</div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  d.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  d.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {d.status || 'Pending'}
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
      <h1 className="text-2xl font-display font-bold">Medicine Marketplace</h1>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading medicines...</div>
      ) : medicines.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-md p-12 rounded-2xl text-center border border-white/10 text-gray-400">
          No medicines currently listed in the store inventory.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {medicines.map((med: any) => (
            <div key={med._id} className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <h3 className="text-lg font-bold text-white">{med.name}</h3>
              <p className="text-sm text-gray-400">Price: <span className="text-green-400 font-semibold">${med.price}</span></p>
              <p className="text-sm text-gray-400">Stock: {med.quantity} available</p>
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
        <SidebarLink to="/medishare/reports" icon={FileText}>Medical Reports</SidebarLink>
        <SidebarLink to="/medishare/verify" icon={QrCode}>Verify Medicine</SidebarLink>
        <SidebarLink to="/medishare/donations" icon={HeartHandshake}>Donations</SidebarLink>
        <SidebarLink to="/medishare/store" icon={ShoppingBag}>Medicine Store</SidebarLink>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto z-10 relative">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/verify" element={<Verify />} />
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

