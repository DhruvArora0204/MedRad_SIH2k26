import os
import glob
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision.models import resnet18, ResNet18_Weights
from monai.transforms import (
    Compose, EnsureChannelFirst, ScaleIntensity, Resize, ToTensor,
    RandRotate, RandZoom, RandGaussianNoise, RandFlip
)
import numpy as np
from tqdm import tqdm
from PIL import Image

class PNGDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.image_paths = []
        self.labels = []
        
        self.label_map = {'01': 0, '02': 1, '03': 2}
        
        for folder in os.listdir(root_dir):
            folder_path = os.path.join(root_dir, folder)
            if not os.path.isdir(folder_path):
                continue
                
            suffix = folder.split('_')[-1]
            if suffix not in self.label_map:
                continue
                
            label = self.label_map[suffix]
            
            # Load ALL png files for maximum accuracy!
            png_files = sorted(glob.glob(os.path.join(folder_path, '*.png')))
                
            for p in png_files:
                self.image_paths.append(p)
                self.labels.append(label)
                
    def __len__(self):
        return len(self.image_paths)
        
    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        
        # Load image as RGB (3 channels) so it matches ImageNet's expected input!
        img = Image.open(img_path).convert('RGB')
        
        # Convert to channels-first numpy array for MONAI: (3, H, W)
        img = np.array(img, dtype=np.float32)
        # PIL is (H, W, C), move C to first dimension
        img = np.moveaxis(img, -1, 0)
        
        if self.transform:
            img = self.transform(img)
            
        return img, label

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # MONAI transforms
    train_transforms = Compose([
        ScaleIntensity(),
        Resize((224, 224)),
        RandRotate(range_x=0.2, prob=0.5, keep_size=True),
        RandZoom(min_zoom=0.9, max_zoom=1.1, prob=0.5),
        RandFlip(prob=0.5, spatial_axis=1),
        RandGaussianNoise(prob=0.1, std=0.01),
        ToTensor()
    ])
    
    val_transforms = Compose([
        ScaleIntensity(),
        Resize((224, 224)),
        ToTensor()
    ])
    
    data_dir = 'c:/Users/Naresh/Desktop/RADIS/Images_png'
    
    full_train_dataset = PNGDataset(data_dir, transform=train_transforms)
    full_val_dataset = PNGDataset(data_dir, transform=val_transforms)
    
    torch.manual_seed(42)
    indices = torch.randperm(len(full_train_dataset)).tolist()
    train_size = int(0.8 * len(full_train_dataset))
    
    train_dataset = torch.utils.data.Subset(full_train_dataset, indices[:train_size])
    val_dataset = torch.utils.data.Subset(full_val_dataset, indices[train_size:])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=0)
    
    print("Loading Pretrained ImageNet Weights...")
    # Using torchvision's ResNet with official pretrained ImageNet weights
    model = resnet18(weights=ResNet18_Weights.IMAGENET1K_V1)
    
    # Freeze the early layers so they retain their ImageNet knowledge!
    for param in model.parameters():
        param.requires_grad = False
        
    # Unfreeze the last few layers to "fine-tune" them for CT scans
    for param in model.layer4.parameters():
        param.requires_grad = True
        
    # Replace the final fully connected layer to output our 3 classes instead of 1000 ImageNet classes
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 3)
    
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=1)
    
    checkpoint_path = 'c:/Users/Naresh/Desktop/RADIS/checkpoint_pretrained.pth'
    best_model_path = 'c:/Users/Naresh/Desktop/RADIS/best_pretrained_resnet.pth'
    
    start_epoch = 0
    best_acc = 0.0
    
    # Set to 10 epochs as requested!
    num_epochs = 10
    
    for epoch in range(start_epoch, num_epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{num_epochs} [Train]")
        for inputs, labels in pbar:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
            
            pbar.set_postfix({'loss': loss.item(), 'acc': 100.*correct/total})
            
        train_loss = running_loss / total
        train_acc = 100. * correct / total
        
        model.eval()
        val_loss = 0.0
        correct = 0
        total = 0
        
        with torch.no_grad():
            pbar = tqdm(val_loader, desc=f"Epoch {epoch+1}/{num_epochs} [Val]")
            for inputs, labels in pbar:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item() * inputs.size(0)
                _, predicted = outputs.max(1)
                total += labels.size(0)
                correct += predicted.eq(labels).sum().item()
                
        val_loss = val_loss / total
        val_acc = 100. * correct / total
        
        print(f"\\nEpoch {epoch+1}/{num_epochs} - Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%, Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        scheduler.step(val_acc)
        
        torch.save({
            'epoch': epoch + 1,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'best_acc': best_acc,
        }, checkpoint_path)
        
        if val_acc >= best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), best_model_path)
            print(f"Saved new best Pretrained model with Val Acc: {best_acc:.2f}%")
            
if __name__ == '__main__':
    main()
