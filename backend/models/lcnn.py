import torch
import torch.nn as nn
import torch.nn.functional as F

class MFM2d(nn.Module):
    """Max-Feature-Map activation for 2D convolution."""
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        super().__init__()
        self.conv = nn.Conv2d(in_channels, out_channels * 2, kernel_size, stride=stride, padding=padding)

    def forward(self, x):
        out = self.conv(x)
        out = torch.max(out[:, :out.shape[1]//2, :, :], out[:, out.shape[1]//2:, :, :])
        return out


class MFM1d(nn.Module):
    """Max-Feature-Map activation for 1D linear layers."""
    def __init__(self, in_features, out_features):
        super().__init__()
        self.fc = nn.Linear(in_features, out_features * 2)

    def forward(self, x):
        out = self.fc(x)
        out = torch.max(out[:, :out.shape[1]//2], out[:, out.shape[1]//2:])
        return out


class LCNN(nn.Module):
    """
    Light CNN (LCNN) with Max-Feature-Map (MFM) activations for Spectrogram / LFCC domain spoofing detection.
    Evaluated on ASVspoof 2019 LA benchmark.
    """
    def __init__(self, in_channels=1, num_classes=2):
        super().__init__()
        self.conv1 = MFM2d(in_channels, 16, kernel_size=5, stride=1, padding=2)
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        self.conv2 = MFM2d(16, 24, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(24)
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)

        self.conv3 = MFM2d(24, 32, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(32)
        self.pool3 = nn.MaxPool2d(kernel_size=2, stride=2)

        self.conv4 = MFM2d(32, 48, kernel_size=3, stride=1, padding=1)
        self.bn4 = nn.BatchNorm2d(48)
        self.pool4 = nn.MaxPool2d(kernel_size=2, stride=2)

        self.adaptive_pool = nn.AdaptiveAvgPool2d((4, 4))
        self.fc1 = MFM1d(48 * 4 * 4, 64)
        self.dropout = nn.Dropout(0.5)
        self.out = nn.Linear(64, num_classes)

        # Grad-CAM storage
        self.gradients = None
        self.activations = None

    def activations_hook(self, grad):
        self.gradients = grad

    def forward(self, x):
        # x: [B, 1, 60, T]
        x = self.conv1(x)
        x = self.pool1(x)

        x = self.conv2(x)
        x = self.bn2(x)
        x = self.pool2(x)

        x = self.conv3(x)
        x = self.bn3(x)
        x = self.pool3(x)

        x = self.conv4(x)
        x = self.bn4(x)
        # register hook for Grad-CAM on conv4 feature map
        if x.requires_grad:
            h = x.register_hook(self.activations_hook)
        self.activations = x
        x = self.pool4(x)

        x = self.adaptive_pool(x)
        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        x = self.dropout(x)
        logits = self.out(x)
        return logits

    def compute_gradcam(self, class_idx=0):
        """
        Compute Grad-CAM heatmap over the convolutional feature map.
        class_idx: 0 for Spoof, 1 for Bonafide.
        """
        if self.gradients is None or self.activations is None:
            # Fallback activation energy map
            if self.activations is not None:
                cam = torch.mean(self.activations, dim=1).squeeze().detach().cpu().numpy()
                cam = np.maximum(cam, 0)
                if cam.max() > 0:
                    cam = cam / cam.max()
                return cam
            return None

        # Global average pooling of gradients
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        cam = torch.sum(weights * self.activations, dim=1).squeeze()
        cam = F.relu(cam)
        cam = cam.detach().cpu().numpy()
        if cam.max() > 0:
            cam = cam / cam.max()
        return cam
