# DeepfakeDetector — Audio Deepfake & Spoofing Detection UI

A modern, edge-to-edge web interface for audio deepfake and synthetic speech spoof detection, built with React, Vite, and Tailwind CSS.

## Overview
This UI represents the complete frontend interface for a dual-branch acoustic deepfake detection system evaluated on the **ASVspoof 2019 Logical Access (LA)** benchmark.

### Key Components

1. **Top Navigation Bar (Edge-to-Edge)**
   - Logo: Audio visualizer icon + `DeepfakeDetector`
   - Identifier badge: `FE-A`
   - Navigation links: `Home`, `Analyze`, `Methodology`, `Technology`, `About`
   - Direct CTA: `+ Analyze Audio` button

2. **Computing Stack (100% Fidelity with Design)**
   - **Header**: `TECHNOLOGY` / `Computing Stack`
   - **System metadata**: `CUDA 12.1 • PyTorch 2.1 • ASVspoof Protocol`
   - **6 Technical Cards**:
     - **PyTorch** (*Inference Engine*): Tensor operations optimized for linear algebra primitives and rapid real-time model evaluation.
     - **RawNet2** (*Raw Waveform*): Sinc-convolution bandpass filters extracting raw acoustic phase information without feature loss.
     - **LCNN** (*Spectrogram Domain*): Max-Feature-Map activation CNN evaluating 60-dimensional LFCC coefficients for pervasive artifacts.
     - **Librosa** (*Signal Processing*): Feature transforms generating Short-Time Fourier Transforms and spectroacoustic descriptors.
     - **FastAPI** (*Async Service*): Sub-millisecond asynchronous routing with OpenAPI validation and non-blocking streaming.
     - **Grad-CAM** (*Explainable AI*): Gradient-weighted activation mapping providing acoustic time-slice evidence visualisations.

3. **Interactive Audio Deepfake Analysis Studio**
   - Drag-and-drop audio upload zone (FLAC, WAV, MP3, 16 kHz mono).
   - 4 preloaded test benchmark samples:
     - Authentic Human Speech (Bonafide Human)
     - Neural Codec Voice Clone (EnCodec / VALL-E Attack)
     - TTS Synthesis (FastSpeech2 + HiFi-GAN A10 Attack)
     - Voice Conversion (StarGAN-VC)
   - Real-time HTML5 Canvas animated waveform and audio scrubber.
   - Dual-branch inference probability breakdown (RawNet2 vs. LCNN vs. Score Fusion).
   - Acoustic Grad-CAM explainability panel highlighting temporal artifact time-slices.

4. **Research Methodology & Generalization Evaluation**
   - EER metrics: Target 1.20% EER vs 2.80% published ASVspoof baseline.
   - Transparent out-of-distribution drop reporting on unseen neural codecs.

5. **View Toggle**
   - **Screenshot View (1:1)**: Pristine minimalist replica matching the provided screenshot (Top Navbar, expansive `#FAF9FF` canvas, and Computing Stack docked at bottom).
   - **Full Interactive Site**: Complete comprehensive application.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app is served at `http://localhost:5173/`.
