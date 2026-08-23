import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, ShieldCheck, Activity, Cpu, Network, Lock, FileText, Database } from 'lucide-react';
// @ts-ignore
import ColorBends from '../components/ui/ColorBends';

const Landing: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background ColorBends */}
        <div className="absolute inset-0 z-0 opacity-80">
           <ColorBends
             colors={["#5227FF", "#FF9FFC", "#00ffd1"]}
             rotation={90}
             speed={0.2}
             scale={1}
             frequency={1}
             warpStrength={1}
             mouseInfluence={1}
             noise={0.15}
             parallax={0.5}
             iterations={1}
             intensity={1.5}
             bandWidth={6}
             transparent
           />
        </div>

        {/* Hero Content */}
        <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-radis-accent animate-pulse-slow"></span>
            <span className="text-sm font-medium tracking-wide text-white/80">THE FUTURE OF MEDICAL INTELLIGENCE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold font-display mb-6 tracking-tighter"
          >
            Intelligence for <br />
            <span className="heading-gradient">Every Layer</span> of Healthcare.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl font-light"
          >
            AI-powered radiology, medical intelligence, and trusted medicine verification — connected in one unified healthcare ecosystem.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/radis" className="btn-primary flex items-center justify-center gap-2 group">
              Explore RADIS 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/medishare" className="btn-secondary flex items-center justify-center gap-2 group">
              Explore MediShare
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full max-w-7xl px-6 py-24 flex flex-col items-center border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">A Seamless Flow of Intelligence</h2>
          <p className="text-white/50">From diagnostic imaging to patient verification.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
          {[
            { title: "Patient Data", icon: <FileText className="w-6 h-6" /> },
            { title: "AI Analysis", icon: <BrainCircuit className="w-6 h-6 text-radis-accent" /> },
            { title: "Clinical Insights", icon: <Activity className="w-6 h-6" /> },
            { title: "Verification", icon: <ShieldCheck className="w-6 h-6 text-medishare-accent" /> },
            { title: "Healthcare Action", icon: <Network className="w-6 h-6" /> }
          ].map((step, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 flex flex-col items-center gap-3 w-48 text-center"
              >
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  {step.icon}
                </div>
                <span className="font-medium text-sm">{step.title}</span>
              </motion.div>
              {i < 4 && (
                <div className="hidden md:block w-8 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
              )}
              {i < 4 && (
                <div className="md:hidden h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent my-2"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* PRODUCT ECOSYSTEM */}
      <section className="w-full max-w-7xl px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RADIS CARD */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-panel p-8 md:p-12 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-radis-accent/10 blur-[100px] rounded-full group-hover:bg-radis-accent/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-radis-accent/20 text-radis-accent rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">RADIS</h2>
            <h3 className="text-xl text-white/80 mb-4 font-light">Radiology AI Decision Support</h3>
            <p className="text-white/50 mb-8 leading-relaxed">
              AI-assisted analysis of brain CT scans with hemorrhage detection, localization, severity assessment, and automated reporting.
            </p>
            <Link to="/radis" className="inline-flex items-center text-radis-accent hover:text-white transition-colors font-medium">
              Explore Workstation <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>

        {/* MEDISHARE CARD */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-panel p-8 md:p-12 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-medishare-accent/10 blur-[100px] rounded-full group-hover:bg-medishare-accent/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-medishare-accent/20 text-medishare-accent rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">MediShare</h2>
            <h3 className="text-xl text-white/80 mb-4 font-light">AI + Blockchain Network</h3>
            <p className="text-white/50 mb-8 leading-relaxed">
              Medical report intelligence, medicine verification, blockchain authentication, secure medicine donations, and safe access.
            </p>
            <Link to="/medishare" className="inline-flex items-center text-medishare-accent hover:text-white transition-colors font-medium">
              Open MediShare <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* TECH STACK */}
      <section className="w-full max-w-7xl px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Powered by Modern Technology</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-display text-white/80 mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5" /> RADIS Core
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Python', 'FastAPI', 'PyTorch', 'ResNet', 'DICOM', 'OpenCV', 'Grad-CAM'].map(tech => (
                <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-display text-white/80 mb-6 flex items-center gap-2">
              <Database className="w-5 h-5" /> MediShare Core
            </h3>
            <div className="flex flex-wrap gap-3">
              {['React', 'Node.js', 'Express', 'MongoDB', 'Solidity', 'Hardhat', 'Ethers.js', 'Gemini AI'].map(tech => (
                <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="w-full py-16 bg-white/5 border-t border-b border-white/10 text-center flex flex-col items-center">
        <Lock className="w-8 h-8 text-white/30 mb-4" />
        <h2 className="text-2xl font-display font-medium mb-2">AI-assisted. Human verified.</h2>
        <p className="text-white/50 max-w-lg text-sm">
          RADIS is presented as decision support rather than an autonomous medical diagnosis system. All automated reports require radiologist verification.
        </p>
      </section>

    </div>
  );
};

export default Landing;
