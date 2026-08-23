import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'RADIS AI Workstation', path: '/radis' },
    { name: 'MediShare Portal', path: '/medishare' },
    { name: 'Admin Console', path: '/admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-black/60 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        
        {/* Brand Logo (Left) */}
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.35)]">
            <div className="w-full h-full bg-black/80 rounded-[11px] flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-tight text-white flex items-center gap-2">
              R×M <span className="text-white/40 font-normal">|</span> <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Ecosystem</span>
            </span>
            <span className="text-[10px] text-white/40 font-mono -mt-0.5 tracking-wider uppercase">Clinical AI Suite</span>
          </div>
        </Link>

        {/* Center / Right Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-white/10 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Live PACS Status Pill (Right) */}
        <div className="hidden lg:flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[11px] font-mono text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>LIVE CLOUD INFERENCE</span>
        </div>

      </div>
    </nav>
  );
};

export default Navigation;
