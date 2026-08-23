import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, BrainCircuit, HeartHandshake } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl py-12 text-sm text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              MedRad
            </span>
          </div>
          <p className="mb-3 text-xs text-zinc-400 leading-relaxed">
            Unified Clinical AI Decision Support & Decentralized Healthcare Platform.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-Assisted • Clinically Grounded</span>
          </div>
        </div>

        {/* Modules Column */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-zinc-300 mb-1">Platforms</h4>
          <Link to="/radis" className="flex items-center gap-2 hover:text-white transition-colors text-xs">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>RADIS Radiology AI Workstation</span>
          </Link>
          <Link to="/medishare" className="flex items-center gap-2 hover:text-white transition-colors text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>MediShare Healthcare & Verification</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-2 hover:text-white transition-colors text-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin & Clinical Operations</span>
          </Link>
        </div>

        {/* Resources Column */}
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-zinc-300 mb-1">Architecture</h4>
          <span className="text-xs text-zinc-400">ResNet-50 Multi-Label ICH Model</span>
          <span className="text-xs text-zinc-400">Grad-CAM Visual Heatmaps</span>
          <span className="text-xs text-zinc-400">Hardhat / Ethereum Smart Contracts</span>
          <span className="text-xs text-zinc-400">Gemini Clinical Report Engine</span>
        </div>

        {/* Legal / Disclaimer */}
        <div className="flex flex-col gap-2">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-zinc-300 mb-1">Disclaimer</h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            MedRad AI Decision Support and MediShare are intended for investigational, assistive decision support and healthcare verification. All radiological outputs require validation by licensed clinical practitioners.
          </p>
          <span className="text-[11px] text-zinc-600 mt-2 font-mono">
            &copy; 2026 MedRad OS. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
