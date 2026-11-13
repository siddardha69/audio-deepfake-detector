import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ComputingStack from './components/ComputingStack';
import AudioAnalyzer from './components/AudioAnalyzer';
import Methodology from './components/Methodology';
import About from './components/About';
import Footer from './components/Footer';
import { Eye, ArrowDown, Sparkles, Layers, Sliders, Shield } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [viewMode, setViewMode] = useState('full'); // 'full' | 'screenshot_exact'

  const scrollTo = (id) => {
    setActiveSection(id);
    if (viewMode === 'screenshot_exact' && id !== 'technology' && id !== 'home') {
      setViewMode('full');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAnalyzer = () => {
    setViewMode('full');
    setTimeout(() => {
      const el = document.getElementById('analyze');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Edge to Edge Sticky Navbar */}
      <Navbar 
        activeSection={activeSection}
        onNavigate={scrollTo}
        onOpenAnalyzer={handleOpenAnalyzer}
      />

      {/* View Switcher Floating Pill */}
      <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur border border-slate-200/90 shadow-md rounded-full p-1 flex items-center gap-1 text-xs">
        <button
          onClick={() => setViewMode('full')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all ${
            viewMode === 'full' 
              ? 'bg-slate-950 text-white shadow-2xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Full Interactive Site
        </button>
        <button
          onClick={() => setViewMode('screenshot_exact')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all ${
            viewMode === 'screenshot_exact' 
              ? 'bg-slate-950 text-white shadow-2xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Screenshot View (1:1)
        </button>
      </div>

      {viewMode === 'screenshot_exact' ? (
        /* EXACT 1:1 SCREENSHOT VIEW: Top bar, expansive #FAF9FF canvas, and Computing Stack docked at bottom */
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6 min-h-[calc(100vh-64px)]">
          {/* Subtle canvas indicator */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 select-none">
            <div className="text-xs font-mono tracking-wider uppercase mb-2 text-slate-400">
              Acoustic Deepfake Detection Canvas
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Edge-to-edge layout matching your design. Toggle "Full Interactive Site" in the bottom-right corner to access the live analysis studio, audio player, and benchmark tables.
            </p>
          </div>

          {/* Computing Stack at bottom */}
          <div className="w-full pb-6">
            <ComputingStack />
          </div>
        </main>
      ) : (
        /* FULL INTERACTIVE APPLICATION VIEW */
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
          
          {/* Hero Section */}
          <section id="home" className="pt-2 sm:pt-6 pb-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100/90 text-slate-700 border border-slate-200/80 mb-5 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ASVspoof 2019 Logical Access Benchmark Evaluated</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Acoustic Voice Deepfake & Spoofing Detection
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
              A dual-domain neural countermeasure combining raw waveform sinc-convolutions with spectrogram LFCC feature maps and acoustic Grad-CAM explainability.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={handleOpenAnalyzer}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-slate-950 text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
              >
                <span>Launch Audio Analyzer</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTo('technology')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 transition-all"
              >
                <span>View Tech Stack</span>
              </button>
            </div>
          </section>

          {/* Core Interactive Audio Analysis Studio */}
          <AudioAnalyzer />

          {/* Research & Benchmarks */}
          <Methodology />

          {/* The Exact Computing Stack component */}
          <ComputingStack />

          {/* Real World Impact & About */}
          <About />

        </main>
      )}

      {/* Global Clean Footer */}
      <Footer onNavigate={scrollTo} />
    </div>
  );
}

