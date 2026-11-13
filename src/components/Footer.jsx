import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-8 mt-12">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
            D
          </div>
          <span className="font-semibold text-slate-900">DeepfakeDetector</span>
          <span className="text-slate-400">•</span>
          <span>Dual-Domain Audio Countermeasures</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-900 transition-colors">Home</button>
          <button onClick={() => onNavigate('analyze')} className="hover:text-slate-900 transition-colors">Analyze</button>
          <button onClick={() => onNavigate('methodology')} className="hover:text-slate-900 transition-colors">Methodology</button>
          <button onClick={() => onNavigate('technology')} className="hover:text-slate-900 transition-colors">Technology</button>
          <button onClick={() => onNavigate('about')} className="hover:text-slate-900 transition-colors">About</button>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          ASVspoof 2019 • CUDA 12.1 • PyTorch 2.1
        </div>
      </div>
    </footer>
  );
}

