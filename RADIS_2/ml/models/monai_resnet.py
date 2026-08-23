import torch
import torch.nn as nn
from monai.networks.nets import resnet18

def get_monai_resnet(pretrained=False, num_classes=3):
    """
    Returns a 2D MONAI ResNet18 model for classification.
    """
    model = resnet18(spatial_dims=2, n_input_channels=1, num_classes=num_classes)
    return model
