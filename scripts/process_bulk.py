#!/usr/bin/env python3
"""
Bulk Image Processor - Prepares your images for LoRA training
"""

import os
import sys
from PIL import Image
import json

def process_bulk_images(source_dir, output_dir='training_ready'):
    """Process and prepare all your images for training"""
    
    # Create output directory
    output_path = os.path.expanduser(f'~/combat-lora-maker/{output_dir}')
    os.makedirs(output_path, exist_ok=True)
    
    # Find all image files
    supported_formats = ['.jpg', '.jpeg', '.png', '.webp', '.bmp']
    images_found = []
    
    for root, dirs, files in os.walk(os.path.expanduser(source_dir)):
        for file in files:
            if any(file.lower().endswith(fmt) for fmt in supported_formats):
                images_found.append(os.path.join(root, file))
    
    print(f"Found {len(images_found)} images to process")
    
    processed = 0
    for idx, img_path in enumerate(images_found, 1):
        try:
            # Open and convert image
            img = Image.open(img_path)
            
            # Convert to RGB if necessary
            if img.mode not in ('RGB', 'L'):
                img = img.convert('RGB')
            
            # Resize if too large (max 1024x1024 for training)
            max_size = 1024
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Save with consistent naming
            output_name = f"punch_{idx:03d}.jpg"
            output_file = os.path.join(output_path, output_name)
            img.save(output_file, 'JPEG', quality=95)
            
            # Create caption file
            caption = "punchstyle, combat, action, fighting, dynamic pose, punching, boxer, martial arts, powerful strike"
            caption_file = os.path.join(output_path, f"punch_{idx:03d}.txt")
            with open(caption_file, 'w') as f:
                f.write(caption)
            
            processed += 1
            print(f"Processed: {output_name}")
            
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
    
    # Create training config
    config = {
        'dataset': output_dir,
        'images_count': processed,
        'trigger_word': 'punchstyle',
        'base_caption': 'combat action fighting punching',
        'recommended_settings': {
            'steps': 1500,
            'learning_rate': 0.0004,
            'network_dim': 32
        }
    }
    
    config_file = os.path.join(output_path, 'training_config.json')
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"\n✅ SUCCESS!")
    print(f"📁 Processed {processed} images")
    print(f"📍 Location: {output_path}")
    print(f"🏷️ Each image has caption with trigger word: 'punchstyle'")
    print(f"\n🚀 READY FOR TRAINING!")
    print(f"Just upload the files from: {output_path}")
    
    return processed

if __name__ == "__main__":
    if len(sys.argv) > 1:
        source = sys.argv[1]
    else:
        # Default locations to check
        locations = [
            "~/Desktop",
            "~/Downloads",
            "~/Documents",
            "~/combat-lora-maker/training_data/punching_full"
        ]
        
        print("Checking common locations for images...")
        for loc in locations:
            path = os.path.expanduser(loc)
            if os.path.exists(path):
                # Count images
                count = sum(1 for f in os.listdir(path) 
                           if f.lower().endswith(('.jpg', '.jpeg', '.png')))
                if count > 0:
                    print(f"Found {count} images in {loc}")
        
        source = input("\nEnter the path to your 40 images folder: ")
    
    process_bulk_images(source)
