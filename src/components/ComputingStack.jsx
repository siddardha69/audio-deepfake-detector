import React from 'react';
import { Cpu, Layers, AudioWaveform, Code2, Zap, Eye } from 'lucide-react';

export default function ComputingStack() {
  const stackItems = [
    {
      id: 'pytorch',
      title: 'PyTorch',
      subtitle: 'Inference Engine',
      description: 'Tensor operations optimized for linear algebra primitives and rapid real-time model evaluation.',
      tag: 'Core Compute',
      icon: Cpu,
    },
    {
      id: 'rawnet2',
      title: 'RawNet2',
      subtitle: 'Raw Waveform',
      description: 'Sinc-convolution bandpass filters extracting raw acoustic phase information without feature loss.',
      tag: 'Time Domain',
      icon: AudioWaveform,
    },
    {
      id: 'lcnn',
      title: 'LCNN',
      subtitle: 'Spectrogram Domain',
      description: 'Max-Feature-Map activation CNN evaluating 60-dimensional LFCC coefficients for pervasive artifacts.',
      tag: 'Freq Domain',
      icon: Layers,
    },
    {
      id: 'librosa',
      title: 'Librosa',
      subtitle: 'Signal Processing',
      description: 'Feature transforms generating Short-Time Fourier Transforms and spectroacoustic descriptors.',
      tag: 'DSP Engine',
      icon: Code2,
    },
    {
      id: 'fastapi',
      title: 'FastAPI',
      subtitle: 'Async Service',
      description: 'Sub-millisecond asynchronous routing with OpenAPI validation and non-blocking streaming.',
      tag: 'API Gateway',
      icon: Zap,
    },
    {
      id: 'gradcam',
      title: 'Grad-CAM',
      subtitle: 'Explainable AI',
      description: 'Gradient-weighted activation mapping providing acoustic time-slice evidence visualisations.',
      tag: 'Interpretability',
      icon: Eye,
    },
  ];

  return (
    <section id="technology" className="w-full">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-6 sm:p-8 md:p-10 transition-all">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1 select-none">
              TECHNOLOGY
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Computing Stack
            </h2>
          </div>

          <div className="text-[11px] md:text-xs font-mono text-slate-500 tracking-tight flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-slate-600">CUDA 12.1</span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-600">PyTorch 2.1</span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-600">ASVspoof Protocol</span>
          </div>
        </div>

        {/* 3x2 Grid matching the screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4.5 pt-6">
          {stackItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#FAFAFC] hover:bg-white border border-slate-200/70 hover:border-slate-300/90 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-slate-900 text-[15px] group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
              </div>
              
              <div className="text-[12px] text-slate-400 font-medium mb-2.5">
                {item.subtitle}
              </div>

              <p className="text-[12.5px] sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

