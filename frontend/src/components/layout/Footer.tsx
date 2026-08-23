import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-sm text-white/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-white text-lg mb-4">R×M Ecosystem</h3>
          <p className="mb-4">Intelligence for Every Layer of Healthcare.</p>
          <p className="text-xs">AI-assisted. Human verified.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-white mb-2">Products</h4>
          <Link to="/radis" className="hover:text-white transition-colors">RADIS</Link>
          <Link to="/medishare" className="hover:text-white transition-colors">MediShare</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-white mb-2">Resources</h4>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Technology</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-white mb-2">Legal</h4>
          <span className="text-xs">Medical disclaimer: For decision support only.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
