import math
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

class SincConv(nn.Module):
    """
    Sinc-convolution layer for raw waveform feature extraction.
    Learns bandpass filters directly using mathematical sinc functions:
    h[n] = 2*f2*sinc(2*pi*f2*n) - 2*f1*sinc(2*pi*f1*n)
    """
    @staticmethod
    def to_mel(hz):
        return 2595 * np.log10(1 + hz / 700)

    @staticmethod
    def to_hz(mel):
        return 700 * (10 ** (mel / 2595) - 1)

    def __init__(self, out_channels=64, kernel_size=129, sample_rate=16000, min_low_hz=50, min_band_hz=50):
        super().__init__()
        if kernel_size % 2 == 0:
            kernel_size = kernel_size + 1
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        self.sample_rate = sample_rate
        self.min_low_hz = min_low_hz
        self.min_band_hz = min_band_hz

        # Initialize filter frequencies linearly in Mel scale
        low_hz = 30
        high_hz = sample_rate / 2 - (min_low_hz + min_band_hz)
        mel = np.linspace(self.to_mel(low_hz), self.to_mel(high_hz), out_channels + 1)
        hz = self.to_hz(mel)

        self.low_hz_ = nn.Parameter(torch.Tensor(hz[:-1]).view(-1, 1))
        self.band_hz_ = nn.Parameter(torch.Tensor(np.diff(hz)).view(-1, 1))

        # Hamming window
        n_lin = torch.linspace(0, (kernel_size / 2) - 1, steps=int((kernel_size / 2)))
        self.window_ = 0.54 - 0.46 * torch.cos(2 * math.pi * n_lin / kernel_size)

        n = (kernel_size - 1) / 2.0
        self.n_ = 2 * math.pi * torch.arange(-n, 0).view(1, -1) / self.sample_rate

    def forward(self, waveforms):
        # waveforms: [Batch, 1, 64600]
        self.n_ = self.n_.to(waveforms.device)
        self.window_ = self.window_.to(waveforms.device)

        low = self.min_low_hz + torch.abs(self.low_hz_)
        high = torch.clamp(low + self.min_band_hz + torch.abs(self.band_hz_), self.min_low_hz, self.sample_rate / 2)
        band = (high - low)[:, 0]

        f_times_t_low = torch.matmul(low, self.n_)
        f_times_t_high = torch.matmul(high, self.n_)

        band_pass_left = ((torch.sin(f_times_t_high) - torch.sin(f_times_t_low)) / (self.n_ / 2)) * self.window_
        band_pass_center = 2 * band.view(-1, 1)
        band_pass_right = torch.flip(band_pass_left, dims=[1])

        band_pass = torch.cat([band_pass_left, band_pass_center, band_pass_right], dim=1)
        band_pass = band_pass / (2 * band[:, None])

        filters = band_pass.view(self.out_channels, 1, self.kernel_size)
        return F.conv1d(waveforms, filters, stride=4, padding=self.kernel_size // 2)


class ResBlock1D(nn.Module):
    """Residual Block for 1D Temporal Representation in RawNet2."""
    def __init__(self, channels):
        super().__init__()
        self.bn1 = nn.BatchNorm1d(channels)
        self.act1 = nn.LeakyReLU(0.2)
        self.conv1 = nn.Conv1d(channels, channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(channels)
        self.act2 = nn.LeakyReLU(0.2)
        self.conv2 = nn.Conv1d(channels, channels, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(kernel_size=3, stride=3)

    def forward(self, x):
        res = x
        out = self.conv1(self.act1(self.bn1(x)))
        out = self.conv2(self.act2(self.bn2(out)))
        out = out + res
        out = self.pool(out)
        return out


class RawNet2(nn.Module):
    """
    RawNet2 architecture: processes raw waveform audio directly via SincConv,
    residual blocks, and GRU for ASVspoof anti-spoofing detection.
    """
    def __init__(self, num_classes=2):
        super().__init__()
        self.sinc_conv = SincConv(out_channels=64, kernel_size=129)
        self.bn0 = nn.BatchNorm1d(64)
        self.act0 = nn.LeakyReLU(0.2)

        self.res1 = ResBlock1D(64)
        self.res2 = ResBlock1D(64)
        self.res3 = ResBlock1D(64)

        # GRU for sequence modelling
        self.gru = nn.GRU(input_size=64, hidden_size=64, num_layers=1, batch_first=True)
        self.fc = nn.Linear(64, num_classes)

        self.last_sinc_features = None

    def forward(self, x):
        # x: [Batch, 1, 64600]
        if x.dim() == 2:
            x = x.unsqueeze(1)
            
        sinc_feat = self.sinc_conv(x)
        self.last_sinc_features = sinc_feat
        out = self.act0(self.bn0(sinc_feat))

        out = self.res1(out)
        out = self.res2(out)
        out = self.res3(out)

        # Permute for GRU: [Batch, Time, Channels]
        out = out.transpose(1, 2)
        gru_out, _ = self.gru(out)
        # Pooling over time
        pooled = torch.mean(gru_out, dim=1)
        logits = self.fc(pooled)
        return logits

