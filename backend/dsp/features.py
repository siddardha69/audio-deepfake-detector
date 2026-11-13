import numpy as np
import scipy.signal
import scipy.fftpack
import soundfile as sf
import io

def load_and_preprocess_audio(audio_bytes: bytes, target_sr: int = 16000, target_length: int = 64600):
    """
    Load audio bytes (WAV, FLAC, OGG), ensure mono 16kHz, and cut or pad to fixed length.
    target_length = 64,600 samples (~4.0375 seconds @ 16kHz), the standard for RawNet2.
    """
    try:
        data, sr = sf.read(io.BytesIO(audio_bytes))
    except Exception as e:
        # Fallback raw byte interpretation if format not recognized
        data = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        sr = target_sr

    # Convert to mono if multi-channel
    if len(data.shape) > 1:
        data = np.mean(data, axis=1)

    # Resample if needed
    if sr != target_sr and len(data) > 0:
        num_target_samples = int(len(data) * target_sr / sr)
        data = scipy.signal.resample(data, num_target_samples)
        sr = target_sr

    # Ensure float32 in [-1.0, 1.0]
    data = data.astype(np.float32)
    max_val = np.max(np.abs(data))
    if max_val > 0:
        data = data / max_val

    raw_len = len(data)

    # Cut or pad to 64,600 samples for RawNet2
    if len(data) > target_length:
        data_fixed = data[:target_length]
    elif len(data) < target_length:
        # Repeat or zero pad
        if len(data) > 0:
            repeats = int(np.ceil(target_length / len(data)))
            data_fixed = np.tile(data, repeats)[:target_length]
        else:
            data_fixed = np.zeros(target_length, dtype=np.float32)
    else:
        data_fixed = data

    return data_fixed, data, sr, raw_len


def extract_lfcc(signal: np.ndarray, sr: int = 16000, num_filters: int = 20, n_fft: int = 512, hop_length: int = 160):
    """
    Extract Linear Frequency Cepstral Coefficients (LFCC) for LCNN.
    As per ASVspoof protocol:
    - Pre-emphasis filter: y[t] = x[t] - 0.97 * x[t-1]
    - Short-Time Fourier Transform (STFT) with Hann window
    - Linear filter bank (equally spaced filters across 0 to sr/2)
    - Discrete Cosine Transform (DCT)
    - Compute Static + Delta + Delta-Delta (60 coefficients total)
    """
    if len(signal) == 0:
        return np.zeros((60, 100), dtype=np.float32)

    # Pre-emphasis
    pre_emphasized = np.append(signal[0], signal[1:] - 0.97 * signal[:-1])

    # STFT
    frequencies, times, Zxx = scipy.signal.stft(
        pre_emphasized,
        fs=sr,
        window='hann',
        nperseg=n_fft,
        noverlap=n_fft - hop_length,
        boundary=None,
        padded=False
    )
    magnitude_spectrum = np.abs(Zxx) ** 2  # Power spectrum
    num_bins = magnitude_spectrum.shape[0]

    # Create linear filter bank
    linear_points = np.linspace(0, sr / 2, num_filters + 2)
    bin_points = np.floor((n_fft + 1) * linear_points / sr).astype(int)
    fbank = np.zeros((num_filters, num_bins))

    for m in range(1, num_filters + 1):
        f_m_minus = bin_points[m - 1]
        f_m = bin_points[m]
        f_m_plus = bin_points[m + 1]

        for k in range(f_m_minus, f_m):
            if f_m > f_m_minus:
                fbank[m - 1, k] = (k - bin_points[m - 1]) / (f_m - f_m_minus)
        for k in range(f_m, f_m_plus):
            if f_m_plus > f_m:
                fbank[m - 1, k] = (bin_points[m + 1] - k) / (f_m_plus - f_m)

    # Apply filter bank to power spectrum
    filter_energies = np.dot(fbank, magnitude_spectrum)
    filter_energies = np.where(filter_energies == 0, np.finfo(float).eps, filter_energies)
    log_filter_energies = np.log(filter_energies)

    # DCT to obtain static LFCC
    lfcc_static = scipy.fftpack.dct(log_filter_energies, type=2, axis=0, norm='ortho')[:num_filters]

    # Compute Deltas and Double-Deltas
    delta_1 = calculate_deltas(lfcc_static, N=2)
    delta_2 = calculate_deltas(delta_1, N=2)

    # Stack: 20 static + 20 delta + 20 double-delta = 60 coefficients
    lfcc_60 = np.vstack([lfcc_static, delta_1, delta_2])
    return lfcc_60.astype(np.float32)


def calculate_deltas(feat: np.ndarray, N: int = 2) -> np.ndarray:
    """Calculate delta features along time frames."""
    num_frames = feat.shape[1]
    deltas = np.zeros_like(feat)
    denominator = 2 * sum([i**2 for i in range(1, N + 1)])

    for t in range(num_frames):
        numerator = np.zeros(feat.shape[0])
        for n in range(1, N + 1):
            t_plus = min(num_frames - 1, t + n)
            t_minus = max(0, t - n)
            numerator += n * (feat[:, t_plus] - feat[:, t_minus])
        deltas[:, t] = numerator / denominator

    return deltas


def generate_waveform_points(signal: np.ndarray, num_points: int = 64):
    """Generate downsampled waveform envelope for UI display."""
    if len(signal) == 0:
        return [0.0] * num_points
    chunk_size = len(signal) // num_points
    if chunk_size == 0:
        return [float(abs(x)) for x in signal[:num_points]]
    
    points = []
    for i in range(num_points):
        chunk = signal[i * chunk_size : (i + 1) * chunk_size]
        if len(chunk) > 0:
            rms = float(np.sqrt(np.mean(chunk**2)))
            points.append(round(min(1.0, rms * 3.5), 3))
        else:
            points.append(0.0)
    return points

