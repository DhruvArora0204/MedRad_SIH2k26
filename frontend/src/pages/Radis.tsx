import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileDown, AlertCircle, Search, Map, Maximize2, 
  Image as ImageIcon, Activity, BrainCircuit, FileText, Trash2, RefreshCw, Info,
  ShieldAlert, CheckCircle2, Copy, Check, Eye, EyeOff, ZoomIn, ZoomOut,
  Sparkles, Stethoscope, AlertTriangle, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { radisService } from '../api/radis';
import type { ScanSummaryItem, ScanDetail, ScanMetadata } from '../api/radis';
// @ts-ignore
import ColorBends from '../components/ui/ColorBends';

const Radis: React.FC = () => {
  const [scans, setScans] = useState<ScanSummaryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'normal'>('all');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [currentScan, setCurrentScan] = useState<ScanDetail | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [metadata, setMetadata] = useState<ScanMetadata | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [windowPreset, setWindowPreset] = useState<string>('brain');
  const [isInverted, setIsInverted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copiedReport, setCopiedReport] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial scans list
  const loadScansList = async () => {
    try {
      const data = await radisService.getScans();
      setScans(data);
      if (data.length > 0 && !selectedScanId) {
        setSelectedScanId(data[0].scan_id);
      }
    } catch (err) {
      console.error('Error fetching scans list:', err);
    }
  };

  useEffect(() => {
    loadScansList();
  }, []);

  // Fetch complete scan details (metadata, image, analysis) when scan or window preset changes
  useEffect(() => {
    if (!selectedScanId) return;

    let isMounted = true;
    setLoadingScan(true);

    radisService.getScanDetails(selectedScanId, windowPreset)
      .then(detail => {
        if (!isMounted) return;
        setCurrentScan(detail);
        setMetadata(detail.metadata || null);
        
        if (detail.image_data_url) {
          setImageUrls(prev => ({ ...prev, [windowPreset]: detail.image_data_url! }));
        }

        if (detail.analysis) {
          setAnalysis(detail.analysis);
          setHasResults(true);
          if (detail.analysis.heatmap_data_url && !activeOverlay) {
            setActiveOverlay('heatmap');
          }
        } else {
          setAnalysis(null);
          setHasResults(false);
          setActiveOverlay(null);
        }
      })
      .catch(err => {
        console.error(`Error loading scan details for ${selectedScanId}:`, err);
      })
      .finally(() => {
        if (isMounted) setLoadingScan(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedScanId, windowPreset]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoadingScan(true);
      const data = await radisService.uploadScan(file);
      setScans(prev => [
        {
          scan_id: data.scan_id,
          filename: data.filename,
          status: data.status,
          uploaded_at: data.uploaded_at,
          metadata: data.metadata
        },
        ...prev
      ]);
      setSelectedScanId(data.scan_id);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoadingScan(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleLoadDemo = async () => {
    try {
      setLoadingScan(true);
      const data = await radisService.loadDemoScan();
      setScans(prev => [
        {
          scan_id: data.scan_id,
          filename: data.filename,
          status: data.status,
          uploaded_at: data.uploaded_at,
          metadata: data.metadata
        },
        ...prev.filter(s => s.scan_id !== data.scan_id)
      ]);
      setSelectedScanId(data.scan_id);
    } catch (err) {
      console.error('Error loading demo scan:', err);
    } finally {
      setLoadingScan(false);
    }
  };

  const handleDeleteScan = async (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    try {
      await radisService.deleteScan(scanId);
      const updated = scans.filter(s => s.scan_id !== scanId);
      setScans(updated);
      if (selectedScanId === scanId) {
        setSelectedScanId(updated.length > 0 ? updated[0].scan_id : null);
        if (updated.length === 0) {
          setCurrentScan(null);
          setAnalysis(null);
          setMetadata(null);
          setHasResults(false);
        }
      }
    } catch (err) {
      console.error('Error deleting scan:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedScanId) return;
    setAnalyzing(true);
    setHasResults(false);

    try {
      const data = await radisService.analyzeScan(selectedScanId);
      setAnalysis(data);
      setHasResults(true);
      if (data.heatmap_data_url) {
        setActiveOverlay('heatmap');
      }

      // Update scans list summary
      const sev = data.decision_support?.assessment?.severity_level;
      const urg = data.decision_support?.assessment?.urgency_level;
      setScans(prev => prev.map(s => s.scan_id === selectedScanId ? { ...s, status: 'analyzed', severity_level: sev, urgency_level: urg } : s));
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyReportText = () => {
    if (analysis?.report_markdown) {
      navigator.clipboard.writeText(analysis.report_markdown);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    }
  };

  const filteredScans = scans.filter(s => {
    const matchesSearch = s.scan_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.filename && s.filename.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterSeverity === 'high') return s.severity_level === 'HIGH';
    if (filterSeverity === 'normal') return s.severity_level === 'NORMAL';
    return true;
  });

  const findings = analysis?.decision_support;
  const assessment = findings?.assessment;

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#07070a] text-white flex overflow-hidden font-sans relative selection:bg-indigo-500/30">
      
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <ColorBends
          colors={["#3b82f6", "#6366f1", "#a855f7"]}
          rotation={35}
          speed={0.08}
          scale={2.2}
          frequency={0.4}
          warpStrength={0.6}
          mouseInfluence={0.3}
          noise={0.15}
          parallax={0.1}
          iterations={1}
          intensity={0.9}
          bandWidth={10}
          transparent
        />
      </div>

      {/* LEFT COLUMN: SCAN BROWSER & QUEUE */}
      <div className="w-80 border-r border-white/[0.08] flex flex-col bg-black/50 backdrop-blur-2xl z-10">
        
        {/* Upload & Actions Section */}
        <div className="p-4 border-b border-white/[0.08] space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h2 className="font-display font-semibold text-sm tracking-wide text-white uppercase">Scan Queue</h2>
            </div>
            <button 
              onClick={loadScansList} 
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              title="Refresh Scans"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <input 
            type="file" 
            accept=".png,.jpg,.jpeg,.webp,.dcm,image/png,image/jpeg" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={triggerUpload} 
              className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Scan
            </button>
            <button 
              onClick={handleLoadDemo} 
              className="py-2.5 px-3 bg-white/[0.07] hover:bg-white/[0.12] text-white/90 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all hover:scale-[1.02]"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" /> Demo Case
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by ID or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1">
            {(['all', 'high', 'normal'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterSeverity(f)}
                className={`flex-1 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  filterSeverity === f 
                    ? 'bg-white/15 text-white border border-white/20' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        {/* Scans List */}
        <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredScans.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-white/20" />
              <div className="text-xs text-white/40 font-medium">No scans found</div>
              <div className="text-[11px] text-white/25">Upload a CT scan or load a demo scan to start inference.</div>
            </div>
          ) : (
            filteredScans.map(scan => {
              const isSelected = selectedScanId === scan.scan_id;
              const format = scan.metadata?.Format || (scan.filename.endsWith('.dcm') ? 'DCM' : 'IMG');
              return (
                <div 
                  key={scan.scan_id}
                  onClick={() => setSelectedScanId(scan.scan_id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group relative border ${
                    isSelected 
                      ? 'bg-gradient-to-r from-indigo-950/40 via-indigo-900/20 to-transparent border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                      : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/15'
                  }`}
                >
                  {/* Left Active Glow Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}

                  <div className="flex justify-between items-start mb-1.5 pl-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white tracking-wide">{scan.scan_id}</span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/10 text-white/60 font-semibold">{format}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {scan.severity_level && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                          scan.severity_level === 'HIGH' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${scan.severity_level === 'HIGH' ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
                          {scan.severity_level}
                        </span>
                      )}
                      <button
                        onClick={(e) => handleDeleteScan(e, scan.scan_id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all text-white/30"
                        title="Delete Scan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-white/60 truncate pl-1 mb-2 font-mono">
                    {scan.filename || 'Brain Scan Image'}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-white/40 pl-1">
                    <span>{new Date(scan.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={`font-semibold capitalize ${scan.status === 'analyzed' ? 'text-indigo-400' : 'text-white/40'}`}>
                      {scan.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CENTER COLUMN: HIGH-TECH MEDICAL VIEWPORT */}
      <div className="flex-grow flex flex-col bg-transparent relative z-10 overflow-hidden">
        
        {/* Workstation Top Toolbar */}
        <div className="h-14 border-b border-white/[0.08] bg-black/60 backdrop-blur-2xl flex items-center px-6 justify-between">
          
          {/* Window Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider mr-1 hidden sm:inline">Preset:</span>
            <button 
              onClick={() => setWindowPreset('brain')} 
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                windowPreset === 'brain' 
                  ? 'text-white bg-blue-500/20 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`} 
              title="Brain Window (WC: 40 WW: 80)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Brain CT
            </button>
            <button 
              onClick={() => setWindowPreset('bone')} 
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                windowPreset === 'bone' 
                  ? 'text-white bg-amber-500/20 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`} 
              title="Bone Detail (WC: 600 WW: 2000)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Bone Detail
            </button>
            <button 
              onClick={() => setWindowPreset('subdural')} 
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                windowPreset === 'subdural' 
                  ? 'text-white bg-rose-500/20 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`} 
              title="Subdural Window (WC: 80 WW: 200)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-rose-400" /> Subdural
            </button>
            
            <div className="w-px h-5 bg-white/10 mx-2" />
            
            {/* Properties Trigger */}
            <button 
              onClick={() => setShowMetadataModal(true)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              title="View Scan & Header Metadata"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Properties
            </button>
          </div>

          {/* AI Overlays & View Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveOverlay(activeOverlay === 'heatmap' ? null : 'heatmap')}
              disabled={!analysis?.heatmap_data_url}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed ${
                activeOverlay === 'heatmap' 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/[0.08]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-orange-400" /> AI Heatmap
            </button>

            <button 
              onClick={() => setActiveOverlay(activeOverlay === 'bbox' ? null : 'bbox')}
              disabled={!analysis?.decision_support?.findings?.some((f: any) => f.bounding_box)}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed ${
                activeOverlay === 'bbox' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/[0.08]'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-red-400" /> Lesion Box
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Quick View Utilities */}
            <button 
              onClick={() => setIsInverted(!isInverted)}
              className={`p-1.5 rounded-lg border transition-colors ${isInverted ? 'bg-white/20 border-white/30 text-white' : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white'}`}
              title="Invert Pixel Values"
            >
              {isInverted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scan Telemetry HUD overlay on top-left of PACS viewer */}
        {metadata && (
          <div className="absolute top-18 left-6 z-20 bg-black/80 backdrop-blur-md px-3 py-2.5 rounded-xl border border-white/10 text-[11px] font-mono text-white/80 pointer-events-none shadow-xl space-y-1">
            <div className="text-white font-bold text-xs border-b border-white/10 pb-1 mb-1 flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                TELEMETRY
              </span>
              <span className="text-indigo-400 font-sans text-[10px] uppercase">{metadata.Format || metadata.Modality || 'CT'}</span>
            </div>
            <div><span className="text-white/40">ID:</span> {metadata.PatientID || currentScan?.scan_id || 'ANONYMOUS'}</div>
            <div><span className="text-white/40">PART:</span> {metadata.BodyPartExamined || 'HEAD'}</div>
            <div><span className="text-white/40">MATRIX:</span> {metadata.Rows || 256} × {metadata.Columns || 256}</div>
            {metadata.FileSize && <div><span className="text-white/40">SIZE:</span> {metadata.FileSize}</div>}
            <div><span className="text-white/40">ZOOM:</span> {(zoomLevel * 100).toFixed(0)}%</div>
          </div>
        )}

        {/* Center Viewport Area */}
        <div className="flex-grow relative flex items-center justify-center p-6 overflow-hidden">
          
          {/* Futuristic Canvas Frame */}
          <div className="relative w-[520px] h-[520px] bg-[#0c0d14] rounded-2xl border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden group">
            
            {/* Viewport Reticle Corners */}
            <div className="absolute top-3 left-3 text-white/30 font-mono text-xs pointer-events-none">⌜</div>
            <div className="absolute top-3 right-3 text-white/30 font-mono text-xs pointer-events-none">⌝</div>
            <div className="absolute bottom-3 left-3 text-white/30 font-mono text-xs pointer-events-none">⌞</div>
            <div className="absolute bottom-3 right-3 text-white/30 font-mono text-xs pointer-events-none">⌟</div>

            {loadingScan && !imageUrls[windowPreset] ? (
              <div className="flex flex-col items-center gap-3 text-white/50">
                <Activity className="w-10 h-10 animate-spin text-indigo-400" />
                <span className="text-xs font-mono tracking-wider uppercase">Loading Image & Matrix Data...</span>
              </div>
            ) : !imageUrls[windowPreset] ? (
              <div className="flex flex-col items-center gap-3 text-white/30">
                <ImageIcon className="w-12 h-12 stroke-[1.2]" />
                <span className="text-xs font-mono">{selectedScanId ? 'Rendering slice...' : 'Select a scan to view'}</span>
              </div>
            ) : (
              <div 
                className="w-full h-full relative flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})`, filter: isInverted ? 'invert(1)' : 'none' }}
              >
                <img 
                  src={imageUrls[windowPreset]} 
                  alt="Medical CT Slice" 
                  className="max-w-full max-h-full object-contain select-none" 
                />
                
                {/* Explainability Heatmap Overlay */}
                <AnimatePresence>
                  {activeOverlay === 'heatmap' && analysis?.heatmap_data_url && (
                    <motion.img 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                      src={analysis.heatmap_data_url}
                      className="absolute inset-0 w-full h-full object-contain mix-blend-screen pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                
                {/* Bounding Box Overlay */}
                <AnimatePresence>
                  {activeOverlay === 'bbox' && analysis?.decision_support?.findings?.map((f: any, i: number) => {
                    if (!f.bounding_box) return null;
                    const [ymin, xmin, ymax, xmax] = f.bounding_box;
                    const top = `${(ymin / 256) * 100}%`;
                    const left = `${(xmin / 256) * 100}%`;
                    const height = `${((ymax - ymin) / 256) * 100}%`;
                    const width = `${((xmax - xmin) / 256) * 100}%`;
                    return (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute border-2 border-red-500 rounded-sm pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                        style={{ top, left, width, height }}
                      >
                        <div className="absolute -top-5 -left-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-[10px] px-1.5 py-0.5 font-bold uppercase whitespace-nowrap text-white rounded shadow">
                          {f.label} {(f.probability * 100).toFixed(0)}%
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
            
            {/* Analyzing Laser Animation Overlay */}
            <AnimatePresence>
              {analyzing && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-30 space-y-4"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                    <BrainCircuit className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-sm font-semibold text-white tracking-wide">Evaluating Neural Representations...</div>
                    <div className="text-xs text-white/50 font-mono">Extracting Grad-CAM heatmaps & generating clinical findings</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom PACS Status Bar */}
        <div className="h-10 border-t border-white/[0.08] bg-black/50 backdrop-blur-xl px-6 flex items-center justify-between text-[11px] font-mono text-white/50">
          <div className="flex items-center gap-4">
            {selectedScanId && (
              <>
                <span><strong className="text-white/70">STUDY:</strong> {selectedScanId}</span>
                <span><strong className="text-white/70">PRESET:</strong> {windowPreset.toUpperCase()}</span>
                <span><strong className="text-white/70">STATUS:</strong> {currentScan?.status?.toUpperCase()}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ResNet-50 + Grad-CAM Engine
            </span>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: AI RESULTS & CLINICAL DECISION SUPPORT */}
      <div className="w-[420px] border-l border-white/[0.08] bg-black/60 backdrop-blur-2xl flex flex-col z-10 shadow-[-10px_0_40px_rgba(0,0,0,0.6)]">
        {!hasResults || !findings ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-900/40 via-indigo-600/20 to-blue-500/30 p-[1px] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <BrainCircuit className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>
            
            <div className="space-y-2 max-w-xs">
              <h3 className="text-lg font-display font-bold text-white">Diagnostic AI Standby</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Run RADIS Multi-label CNN to classify intracranial hemorrhages, extract explainability heatmaps, and generate structured radiology reports.
              </p>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={analyzing || !selectedScanId}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-[1.02]"
            >
              <BrainCircuit className="w-4 h-4" />
              {analyzing ? 'Analyzing Scan...' : 'Run Neural Inference'}
            </button>
          </div>
        ) : (
          <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-400" />
                  Clinical Decision Support
                </h2>
                <div className="text-[10px] text-white/40 font-mono mt-0.5">
                  Analyzed at: {analysis.analyzed_at ? new Date(analysis.analyzed_at).toLocaleTimeString() : 'Just now'}
                </div>
              </div>
              <button 
                onClick={() => setHasResults(false)} 
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="p-4 space-y-5">
              
              {/* Dual Severity & Urgency Triage Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                  assessment?.severity_level === 'HIGH' 
                    ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Triage Severity</div>
                  <div className="text-base font-bold flex items-center gap-1.5">
                    {assessment?.severity_level === 'HIGH' ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {assessment?.severity_level || 'NORMAL'}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                  assessment?.urgency_level === 'HIGH' 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Clinical Urgency</div>
                  <div className="text-base font-bold flex items-center gap-1.5">
                    {assessment?.urgency_level === 'HIGH' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {assessment?.urgency_level || 'ROUTINE'}
                  </div>
                </div>
              </div>

              {/* Actionable Clinical Recommendation Banner */}
              {assessment?.workflow_recommendation && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 shadow-lg ${
                  assessment.urgency_level === 'HIGH' 
                    ? 'bg-red-950/30 border-red-500/30 text-red-200 shadow-red-950/20' 
                    : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200 shadow-indigo-950/20'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-white">Action Recommendation</span>
                    <span className="text-white/80 leading-relaxed">{assessment.workflow_recommendation}</span>
                  </div>
                </div>
              )}

              {/* Subtype Probability Spectrum */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" /> Subtype Probabilities
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Threshold: 50%</span>
                </h3>
                
                <div className="space-y-2.5 bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08]">
                  {findings?.findings?.map((item: any, i: number) => {
                    const isPositive = item.probability >= 0.5;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-white/80 capitalize flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-red-400' : 'bg-white/20'}`} />
                            {item.label} Bleed
                          </span>
                          <span className={`font-mono font-bold ${isPositive ? 'text-red-400' : 'text-white/60'}`}>
                            {(item.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden p-[1px]">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              isPositive 
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                            }`} 
                            style={{ width: `${Math.min(100, item.probability * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {(!findings?.findings || findings.findings.length === 0) && (
                    <div className="text-xs text-white/40 italic py-2 text-center">No active hemorrhage flags detected.</div>
                  )}
                </div>
              </div>

              {/* Generated Radiology Report */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-white/70" /> Structured Report
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {analysis.is_valid_report && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-mono font-bold border border-emerald-500/30">
                        VALIDATED
                      </span>
                    )}
                    <button 
                      onClick={copyReportText}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Copy Markdown Report"
                    >
                      {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-3.5 text-xs font-mono text-white/80 h-52 overflow-y-auto custom-scrollbar border border-white/[0.08] leading-relaxed select-text">
                  <div className="mb-2 uppercase text-[10px] text-indigo-400 tracking-widest border-b border-white/10 pb-1.5 flex items-center justify-between">
                    <span>AI PRE-READ REPORT</span>
                    <span className="text-white/40">CONFIDENTIAL</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-white/85">{analysis.report_markdown}</pre>
                </div>
              </div>

              {/* Re-analyze Button */}
              <button 
                onClick={handleAnalyze} 
                disabled={analyzing}
                className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/80 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin text-indigo-400' : ''}`} /> Re-evaluate Pipeline
              </button>

            </div>
          </div>
        )}
      </div>

      {/* Properties & DICOM Tags Modal */}
      {showMetadataModal && metadata && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0e0f17] border border-white/15 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" /> Image & DICOM Properties
              </h3>
              <button 
                onClick={() => setShowMetadataModal(false)}
                className="text-white/40 hover:text-white text-xl font-bold px-1"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-1 text-xs font-mono max-h-80 overflow-y-auto custom-scrollbar p-3 bg-black/40 rounded-xl border border-white/[0.08]">
              {Object.entries(metadata).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-white/50">{key}:</span>
                  <span className="text-indigo-300 font-semibold">{val === null || val === undefined ? 'N/A' : String(val)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowMetadataModal(false)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Radis;
