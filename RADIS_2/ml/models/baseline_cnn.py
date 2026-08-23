import torch
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights

class BaselineResNet(nn.Module):
    def __init__(self, num_classes: int = 6, pretrained: bool = False):
        super(BaselineResNet, self).__init__()
        weights = ResNet50_Weights.DEFAULT if pretrained else None
        self.base_model = resnet50(weights=weights)
        in_features = self.base_model.fc.in_features
        self.base_model.fc = nn.Linear(in_features, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.base_model(x)
