import React, { useState, useEffect } from 'react';
import { Activity, Plus, Sparkles, SlidersHorizontal, Volume2 } from 'lucide-react';

export default function Navbar({ activeSection, onNavigate, onOpenAnalyzer }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'technology', label: 'Technology' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]' 
          : 'bg-white border-b border-slate-200/80'
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
        
        {/* Left: Brand & Badge */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Logo Icon */}
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-colors">
            <svg 
              className="w-4 h-4 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="3" strokeWidth="1.8" />
              <path d="M6 12h.01" />
              <path d="M10 8v8" />
              <path d="M14 6v12" />
              <path d="M18 10v4" />
            </svg>
          </div>

          {/* Brand Name */}
          <span className="font-semibold text-slate-900 text-sm md:text-[15px] tracking-tight">
            DeepfakeDetector
          </span>

          {/* Badge */}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-500 border border-slate-200/90 leading-none">
            FE-A
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-[13px] lg:text-sm font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Analyze Audio CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAnalyzer}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-[13px] font-medium bg-slate-950 text-white hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm group"
          >
            <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
            <span>Analyze Audio</span>
          </button>
        </div>

      </div>
    </header>
  );
}

