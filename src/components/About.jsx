import React from 'react';
import { Shield, PhoneCall, KeyRound, Globe, FileCheck, CheckCircle } from 'lucide-react';

export default function About() {
  const useCases = [
    {
      icon: PhoneCall,
      title: 'Phone & Banking Fraud',
      desc: 'Screening against executive impersonation and emergency family voice clone scams targeting wire transfers.',
    },
    {
      icon: KeyRound,
      title: 'Biometric Voice Auth Bypass',
      desc: 'Hardening financial call-centers and voice-ID logins against synthetic spoofing replay attacks.',
    },
    {
      icon: Globe,
      title: 'Misinformation & Election Integrity',
      desc: 'Rapid verification tool for journalists and fact-checkers investigating viral suspicious voice recordings.',
    },
    {
      icon: FileCheck,
      title: 'Live KYC & Call Center Verification',
      desc: 'Verifying real human presence in customer support conversations with sub-millisecond API response.',
    },
  ];

  return (
    <section id="about" className="w-full">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-6 sm:p-8 md:p-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
              REAL-WORLD IMPACT
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Why Voice Deepfake Detection Matters
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Open Source • Responsible AI
          </div>
        </div>

        {/* Narrative */}
        <div className="my-6 max-w-3xl">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Cloning a voice now takes seconds of sample audio and accessible AI models. That makes voice an increasingly fragile proof of identity. Our project delivers an explainable, dual-branch countermeasure system built not just for benchmarks, but for genuine deployment safety—with transparent error metrics and acoustic root-cause explanations.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div 
                key={i} 
                className="p-4 rounded-xl border border-slate-200/70 bg-[#FAFAFC] hover:bg-white hover:border-slate-300 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interview & Design Rules */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Trained on ASVspoof 2019 Logical Access (LA) Benchmark</span>
          </div>
          <div className="font-mono text-slate-400">
            PyTorch • RawNet2 • LCNN • FastAPI • Grad-CAM
          </div>
        </div>

      </div>
    </section>
  );
}

